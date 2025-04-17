from kubernetes import client, config
from kubernetes.client.rest import ApiException
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timezone
import logging
import os
import yaml
import json
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Kubernetes configuration
try:
    # Try to load in-cluster configuration (when running inside a pod)
    config.load_incluster_config()
    logger.info("Loaded in-cluster Kubernetes configuration")
except config.ConfigException:
    try:
        # Fall back to kubeconfig for local development
        config.load_kube_config()
        logger.info("Loaded kubeconfig configuration")
    except config.ConfigException:
        logger.error("Could not configure Kubernetes client")
        raise

# Initialize API clients
core_v1_api = client.CoreV1Api()
apps_v1_api = client.AppsV1Api()

# Get the current namespace
try:
    with open("/var/run/secrets/kubernetes.io/serviceaccount/namespace", "r") as f:
        NAMESPACE = f.read().strip()
except FileNotFoundError:
    NAMESPACE = "vibecode"  # Default namespace for local development
    logger.warning(f"Using default namespace: {NAMESPACE}")

# Constants
DEFAULT_CONTAINER_IMAGE = "python:3.9-slim"
DEFAULT_CONTAINER_PORT = 8000
DEFAULT_CPU_LIMIT = "500m"
DEFAULT_MEMORY_LIMIT = "512Mi"
DEFAULT_CPU_REQUEST = "100m"
DEFAULT_MEMORY_REQUEST = "128Mi"
DEFAULT_STORAGE_SIZE = "1Gi"
DEFAULT_STORAGE_CLASS = "standard"

class KubernetesClient:
    @staticmethod
    def generate_resource_names(project_id: str) -> Dict[str, str]:
        """Generate consistent resource names for a project"""
        prefix = f"project-{project_id}"
        return {
            "deployment": f"{prefix}-deployment",
            "service": f"{prefix}-service",
            "pvc": f"{prefix}-pvc",
            "configmap": f"{prefix}-configmap",
        }

    @staticmethod
    def create_pvc(
        project_id: str,
        storage_size: str = DEFAULT_STORAGE_SIZE,
        storage_class: str = DEFAULT_STORAGE_CLASS,
    ) -> Dict[str, Any]:
        """Create a Persistent Volume Claim for a project"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        pvc_name = resource_names["pvc"]

        # Define the PVC
        pvc = client.V1PersistentVolumeClaim(
            api_version="v1",
            kind="PersistentVolumeClaim",
            metadata=client.V1ObjectMeta(
                name=pvc_name,
                namespace=NAMESPACE,
                labels={
                    "app": "vibecode",
                    "project-id": project_id,
                },
            ),
            spec=client.V1PersistentVolumeClaimSpec(
                access_modes=["ReadWriteOnce"],
                resources=client.V1ResourceRequirements(
                    requests={"storage": storage_size}
                ),
                storage_class_name=storage_class,
            ),
        )

        try:
            # Create the PVC
            api_response = core_v1_api.create_namespaced_persistent_volume_claim(
                namespace=NAMESPACE, body=pvc
            )
            logger.info(f"Created PVC: {pvc_name}")
            return {
                "name": api_response.metadata.name,
                "status": api_response.status.phase if api_response.status else "Unknown",
            }
        except ApiException as e:
            logger.error(f"Exception when creating PVC: {e}")
            if e.status == 409:  # Conflict - PVC already exists
                logger.info(f"PVC {pvc_name} already exists, retrieving it")
                api_response = core_v1_api.read_namespaced_persistent_volume_claim(
                    name=pvc_name, namespace=NAMESPACE
                )
                return {
                    "name": api_response.metadata.name,
                    "status": api_response.status.phase if api_response.status else "Unknown",
                }
            raise

    @staticmethod
    def create_configmap_for_files(
        project_id: str, files: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """Create a ConfigMap containing project files"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        configmap_name = resource_names["configmap"]

        # Prepare data for ConfigMap
        data = {}
        for file in files:
            filename = file.get("name", "")
            content = file.get("content", "")
            if filename and content:
                data[filename] = content

        # Define the ConfigMap
        configmap = client.V1ConfigMap(
            api_version="v1",
            kind="ConfigMap",
            metadata=client.V1ObjectMeta(
                name=configmap_name,
                namespace=NAMESPACE,
                labels={
                    "app": "vibecode",
                    "project-id": project_id,
                },
            ),
            data=data,
        )

        try:
            # Create the ConfigMap
            api_response = core_v1_api.create_namespaced_config_map(
                namespace=NAMESPACE, body=configmap
            )
            logger.info(f"Created ConfigMap: {configmap_name}")
            return {
                "name": api_response.metadata.name,
                "data_keys": list(api_response.data.keys()) if api_response.data else [],
            }
        except ApiException as e:
            logger.error(f"Exception when creating ConfigMap: {e}")
            if e.status == 409:  # Conflict - ConfigMap already exists
                logger.info(f"ConfigMap {configmap_name} already exists, updating it")
                api_response = core_v1_api.replace_namespaced_config_map(
                    name=configmap_name, namespace=NAMESPACE, body=configmap
                )
                return {
                    "name": api_response.metadata.name,
                    "data_keys": list(api_response.data.keys()) if api_response.data else [],
                }
            raise

    @staticmethod
    def create_deployment(
        project_id: str,
        pvc_name: str,
        configmap_name: str,
        container_image: str = DEFAULT_CONTAINER_IMAGE,
        container_port: int = DEFAULT_CONTAINER_PORT,
        cpu_limit: str = DEFAULT_CPU_LIMIT,
        memory_limit: str = DEFAULT_MEMORY_LIMIT,
        cpu_request: str = DEFAULT_CPU_REQUEST,
        memory_request: str = DEFAULT_MEMORY_REQUEST,
        command: Optional[List[str]] = None,
        args: Optional[List[str]] = None,
        env_vars: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        """Create a Deployment for a project"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        deployment_name = resource_names["deployment"]

        # Set default command based on language if not provided
        if command is None:
            command = ["python", "-m", "http.server", str(container_port)]

        # Convert env_vars to Kubernetes format
        k8s_env_vars = []
        if env_vars:
            for env_var in env_vars:
                k8s_env_vars.append(
                    client.V1EnvVar(
                        name=env_var.get("name", ""),
                        value=env_var.get("value", ""),
                    )
                )

        # Define the Deployment
        deployment = client.V1Deployment(
            api_version="apps/v1",
            kind="Deployment",
            metadata=client.V1ObjectMeta(
                name=deployment_name,
                namespace=NAMESPACE,
                labels={
                    "app": "vibecode",
                    "project-id": project_id,
                },
            ),
            spec=client.V1DeploymentSpec(
                replicas=1,
                selector=client.V1LabelSelector(
                    match_labels={
                        "app": "vibecode",
                        "project-id": project_id,
                    }
                ),
                template=client.V1PodTemplateSpec(
                    metadata=client.V1ObjectMeta(
                        labels={
                            "app": "vibecode",
                            "project-id": project_id,
                        }
                    ),
                    spec=client.V1PodSpec(
                        containers=[
                            client.V1Container(
                                name=f"project-{project_id}",
                                image=container_image,
                                command=command,
                                args=args,
                                ports=[
                                    client.V1ContainerPort(
                                        container_port=container_port
                                    )
                                ],
                                resources=client.V1ResourceRequirements(
                                    limits={
                                        "cpu": cpu_limit,
                                        "memory": memory_limit,
                                    },
                                    requests={
                                        "cpu": cpu_request,
                                        "memory": memory_request,
                                    },
                                ),
                                volume_mounts=[
                                    client.V1VolumeMount(
                                        name="project-data",
                                        mount_path="/app/data",
                                    ),
                                    client.V1VolumeMount(
                                        name="project-files",
                                        mount_path="/app/src",
                                    ),
                                ],
                                env=k8s_env_vars,
                                working_dir="/app/src",
                            )
                        ],
                        volumes=[
                            client.V1Volume(
                                name="project-data",
                                persistent_volume_claim=client.V1PersistentVolumeClaimVolumeSource(
                                    claim_name=pvc_name
                                ),
                            ),
                            client.V1Volume(
                                name="project-files",
                                config_map=client.V1ConfigMapVolumeSource(
                                    name=configmap_name
                                ),
                            ),
                        ],
                    ),
                ),
            ),
        )

        try:
            # Create the Deployment
            api_response = apps_v1_api.create_namespaced_deployment(
                namespace=NAMESPACE, body=deployment
            )
            logger.info(f"Created Deployment: {deployment_name}")
            return {
                "name": api_response.metadata.name,
                "replicas": api_response.spec.replicas,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        except ApiException as e:
            logger.error(f"Exception when creating Deployment: {e}")
            if e.status == 409:  # Conflict - Deployment already exists
                logger.info(f"Deployment {deployment_name} already exists, updating it")
                api_response = apps_v1_api.replace_namespaced_deployment(
                    name=deployment_name, namespace=NAMESPACE, body=deployment
                )
                return {
                    "name": api_response.metadata.name,
                    "replicas": api_response.spec.replicas,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            raise

    @staticmethod
    def create_service(
        project_id: str, container_port: int = DEFAULT_CONTAINER_PORT
    ) -> Dict[str, Any]:
        """Create a Service for a project"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        service_name = resource_names["service"]

        # Define the Service
        service = client.V1Service(
            api_version="v1",
            kind="Service",
            metadata=client.V1ObjectMeta(
                name=service_name,
                namespace=NAMESPACE,
                labels={
                    "app": "vibecode",
                    "project-id": project_id,
                },
            ),
            spec=client.V1ServiceSpec(
                selector={
                    "app": "vibecode",
                    "project-id": project_id,
                },
                ports=[
                    client.V1ServicePort(
                        port=container_port,
                        target_port=container_port,
                        protocol="TCP",
                    )
                ],
                type="ClusterIP",
            ),
        )

        try:
            # Create the Service
            api_response = core_v1_api.create_namespaced_service(
                namespace=NAMESPACE, body=service
            )
            logger.info(f"Created Service: {service_name}")
            return {
                "name": api_response.metadata.name,
                "cluster_ip": api_response.spec.cluster_ip,
                "ports": [
                    {"port": port.port, "target_port": port.target_port}
                    for port in api_response.spec.ports
                ],
            }
        except ApiException as e:
            logger.error(f"Exception when creating Service: {e}")
            if e.status == 409:  # Conflict - Service already exists
                logger.info(f"Service {service_name} already exists, retrieving it")
                api_response = core_v1_api.read_namespaced_service(
                    name=service_name, namespace=NAMESPACE
                )
                return {
                    "name": api_response.metadata.name,
                    "cluster_ip": api_response.spec.cluster_ip,
                    "ports": [
                        {"port": port.port, "target_port": port.target_port}
                        for port in api_response.spec.ports
                    ],
                }
            raise

    @staticmethod
    def get_deployment_status(deployment_name: str) -> Dict[str, Any]:
        """Get the status of a Deployment"""
        try:
            api_response = apps_v1_api.read_namespaced_deployment_status(
                name=deployment_name, namespace=NAMESPACE
            )
            return {
                "name": api_response.metadata.name,
                "replicas": api_response.spec.replicas,
                "available_replicas": api_response.status.available_replicas,
                "ready_replicas": api_response.status.ready_replicas,
                "updated_replicas": api_response.status.updated_replicas,
                "conditions": [
                    {
                        "type": condition.type,
                        "status": condition.status,
                        "reason": condition.reason,
                        "message": condition.message,
                    }
                    for condition in api_response.status.conditions
                ]
                if api_response.status.conditions
                else [],
            }
        except ApiException as e:
            logger.error(f"Exception when getting Deployment status: {e}")
            raise

    @staticmethod
    def get_pod_logs(project_id: str, tail_lines: int = 100) -> str:
        """Get logs from the pod for a project"""
        try:
            # Get pods with the project-id label
            pods = core_v1_api.list_namespaced_pod(
                namespace=NAMESPACE,
                label_selector=f"project-id={project_id}",
            )

            if not pods.items:
                return "No pods found for this project"

            # Get the first pod (there should only be one for a project)
            pod_name = pods.items[0].metadata.name
            logs = core_v1_api.read_namespaced_pod_log(
                name=pod_name,
                namespace=NAMESPACE,
                tail_lines=tail_lines,
            )
            return logs
        except ApiException as e:
            logger.error(f"Exception when getting pod logs: {e}")
            return f"Error getting logs: {str(e)}"

    @staticmethod
    def start_container(project_id: str) -> Dict[str, Any]:
        """Start a container for a project by scaling the deployment to 1 replica"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        deployment_name = resource_names["deployment"]

        try:
            # Get the current deployment
            deployment = apps_v1_api.read_namespaced_deployment(
                name=deployment_name, namespace=NAMESPACE
            )

            # Set replicas to 1
            deployment.spec.replicas = 1

            # Update the deployment
            api_response = apps_v1_api.replace_namespaced_deployment(
                name=deployment_name, namespace=NAMESPACE, body=deployment
            )

            logger.info(f"Started container for project {project_id}")
            return {
                "name": api_response.metadata.name,
                "replicas": api_response.spec.replicas,
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        except ApiException as e:
            logger.error(f"Exception when starting container: {e}")
            raise

    @staticmethod
    def stop_container(project_id: str) -> Dict[str, Any]:
        """Stop a container for a project by scaling the deployment to 0 replicas"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        deployment_name = resource_names["deployment"]

        try:
            # Get the current deployment
            deployment = apps_v1_api.read_namespaced_deployment(
                name=deployment_name, namespace=NAMESPACE
            )

            # Set replicas to 0
            deployment.spec.replicas = 0

            # Update the deployment
            api_response = apps_v1_api.replace_namespaced_deployment(
                name=deployment_name, namespace=NAMESPACE, body=deployment
            )

            logger.info(f"Stopped container for project {project_id}")
            return {
                "name": api_response.metadata.name,
                "replicas": api_response.spec.replicas,
                "stopped_at": datetime.now(timezone.utc).isoformat(),
            }
        except ApiException as e:
            logger.error(f"Exception when stopping container: {e}")
            raise

    @staticmethod
    def delete_project_resources(project_id: str) -> Dict[str, Any]:
        """Delete all Kubernetes resources for a project"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        results = {}

        # Delete Deployment
        try:
            apps_v1_api.delete_namespaced_deployment(
                name=resource_names["deployment"], namespace=NAMESPACE
            )
            results["deployment"] = "deleted"
        except ApiException as e:
            if e.status != 404:  # Not Found
                logger.error(f"Exception when deleting Deployment: {e}")
                results["deployment"] = f"error: {str(e)}"
            else:
                results["deployment"] = "not found"

        # Delete Service
        try:
            core_v1_api.delete_namespaced_service(
                name=resource_names["service"], namespace=NAMESPACE
            )
            results["service"] = "deleted"
        except ApiException as e:
            if e.status != 404:  # Not Found
                logger.error(f"Exception when deleting Service: {e}")
                results["service"] = f"error: {str(e)}"
            else:
                results["service"] = "not found"

        # Delete ConfigMap
        try:
            core_v1_api.delete_namespaced_config_map(
                name=resource_names["configmap"], namespace=NAMESPACE
            )
            results["configmap"] = "deleted"
        except ApiException as e:
            if e.status != 404:  # Not Found
                logger.error(f"Exception when deleting ConfigMap: {e}")
                results["configmap"] = f"error: {str(e)}"
            else:
                results["configmap"] = "not found"

        # Delete PVC
        try:
            core_v1_api.delete_namespaced_persistent_volume_claim(
                name=resource_names["pvc"], namespace=NAMESPACE
            )
            results["pvc"] = "deleted"
        except ApiException as e:
            if e.status != 404:  # Not Found
                logger.error(f"Exception when deleting PVC: {e}")
                results["pvc"] = f"error: {str(e)}"
            else:
                results["pvc"] = "not found"

        logger.info(f"Deleted resources for project {project_id}: {results}")
        return results

    @staticmethod
    def get_project_resources(project_id: str) -> Dict[str, Any]:
        """Get all Kubernetes resources for a project"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        results = {}

        # Get Deployment
        try:
            deployment = apps_v1_api.read_namespaced_deployment(
                name=resource_names["deployment"], namespace=NAMESPACE
            )
            results["deployment"] = {
                "name": deployment.metadata.name,
                "replicas": deployment.spec.replicas,
                "available_replicas": deployment.status.available_replicas if deployment.status.available_replicas else 0,
                "ready_replicas": deployment.status.ready_replicas if deployment.status.ready_replicas else 0,
            }
        except ApiException as e:
            if e.status == 404:  # Not Found
                results["deployment"] = None
            else:
                logger.error(f"Exception when getting Deployment: {e}")
                results["deployment"] = f"error: {str(e)}"

        # Get Service
        try:
            service = core_v1_api.read_namespaced_service(
                name=resource_names["service"], namespace=NAMESPACE
            )
            results["service"] = {
                "name": service.metadata.name,
                "cluster_ip": service.spec.cluster_ip,
                "ports": [
                    {"port": port.port, "target_port": port.target_port}
                    for port in service.spec.ports
                ],
            }
        except ApiException as e:
            if e.status == 404:  # Not Found
                results["service"] = None
            else:
                logger.error(f"Exception when getting Service: {e}")
                results["service"] = f"error: {str(e)}"

        # Get PVC
        try:
            pvc = core_v1_api.read_namespaced_persistent_volume_claim(
                name=resource_names["pvc"], namespace=NAMESPACE
            )
            results["pvc"] = {
                "name": pvc.metadata.name,
                "status": pvc.status.phase if pvc.status else "Unknown",
                "capacity": pvc.status.capacity.get("storage", "Unknown") if pvc.status and pvc.status.capacity else "Unknown",
            }
        except ApiException as e:
            if e.status == 404:  # Not Found
                results["pvc"] = None
            else:
                logger.error(f"Exception when getting PVC: {e}")
                results["pvc"] = f"error: {str(e)}"

        # Get ConfigMap
        try:
            configmap = core_v1_api.read_namespaced_config_map(
                name=resource_names["configmap"], namespace=NAMESPACE
            )
            results["configmap"] = {
                "name": configmap.metadata.name,
                "data_keys": list(configmap.data.keys()) if configmap.data else [],
            }
        except ApiException as e:
            if e.status == 404:  # Not Found
                results["configmap"] = None
            else:
                logger.error(f"Exception when getting ConfigMap: {e}")
                results["configmap"] = f"error: {str(e)}"

        # Get Pods
        try:
            pods = core_v1_api.list_namespaced_pod(
                namespace=NAMESPACE,
                label_selector=f"project-id={project_id}",
            )
            results["pods"] = [
                {
                    "name": pod.metadata.name,
                    "status": pod.status.phase,
                    "ready": all(
                        container_status.ready
                        for container_status in pod.status.container_statuses
                    )
                    if pod.status.container_statuses
                    else False,
                    "restart_count": sum(
                        container_status.restart_count
                        for container_status in pod.status.container_statuses
                    )
                    if pod.status.container_statuses
                    else 0,
                    "start_time": pod.status.start_time.isoformat()
                    if pod.status.start_time
                    else None,
                }
                for pod in pods.items
            ]
        except ApiException as e:
            logger.error(f"Exception when getting Pods: {e}")
            results["pods"] = f"error: {str(e)}"

        return results

    @staticmethod
    def update_project_files(project_id: str, files: List[Dict[str, str]]) -> Dict[str, Any]:
        """Update the ConfigMap with new project files"""
        resource_names = KubernetesClient.generate_resource_names(project_id)
        configmap_name = resource_names["configmap"]

        # Prepare data for ConfigMap
        data = {}
        for file in files:
            filename = file.get("name", "")
            content = file.get("content", "")
            if filename and content:
                data[filename] = content

        try:
            # Get the current ConfigMap
            configmap = core_v1_api.read_namespaced_config_map(
                name=configmap_name, namespace=NAMESPACE
            )

            # Update the data
            configmap.data = data

            # Update the ConfigMap
            api_response = core_v1_api.replace_namespaced_config_map(
                name=configmap_name, namespace=NAMESPACE, body=configmap
            )
            logger.info(f"Updated ConfigMap: {configmap_name}")
            return {
                "name": api_response.metadata.name,
                "data_keys": list(api_response.data.keys()) if api_response.data else [],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        except ApiException as e:
            if e.status == 404:  # Not Found - ConfigMap doesn't exist
                logger.info(f"ConfigMap {configmap_name} not found, creating it")
                return KubernetesClient.create_configmap_for_files(project_id, files)
            logger.error(f"Exception when updating ConfigMap: {e}")
            raise
