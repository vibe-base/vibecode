import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { containerService } from '../../services/container-service';
import { ContainerStatus } from '../../types/container';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';

export function DockerView() {
  const { projectId } = useParams<{ projectId: string }>();
  const [containerStatus, setContainerStatus] = useState<ContainerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchContainerStatus();
      const interval = setInterval(fetchContainerStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  const fetchContainerStatus = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const status = await containerService.getContainerStatus(projectId);
      setContainerStatus(status);
    } catch (error) {
      console.error('Error fetching container status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartContainer = async () => {
    if (!projectId) return;
    
    try {
      setActionLoading(true);
      await containerService.startContainer(projectId);
      await fetchContainerStatus();
    } catch (error) {
      console.error('Error starting container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopContainer = async () => {
    if (!projectId) return;
    
    try {
      setActionLoading(true);
      await containerService.stopContainer(projectId);
      await fetchContainerStatus();
    } catch (error) {
      console.error('Error stopping container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestartContainer = async () => {
    if (!projectId) return;
    
    try {
      setActionLoading(true);
      await containerService.restartContainer(projectId);
      await fetchContainerStatus();
    } catch (error) {
      console.error('Error restarting container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateContainer = async () => {
    if (!projectId) return;
    
    try {
      setActionLoading(true);
      await containerService.createContainerResources(projectId);
      await fetchContainerStatus();
    } catch (error) {
      console.error('Error creating container:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (!projectId) {
    return (
      <div className="p-4">
        <p className="text-sm">No project selected.</p>
      </div>
    );
  }

  if (loading && !containerStatus) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Spinner size="md" />
        <span className="ml-2">Loading container status...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-sm font-semibold uppercase tracking-wider mb-4 px-2">Containers</div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Project Container</h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchContainerStatus}
            disabled={actionLoading}
          >
            Refresh
          </Button>
        </div>
        
        {containerStatus ? (
          <div className="border rounded-md p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${containerStatus.running ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">{containerStatus.status}</span>
              </div>
              <div>
                {containerStatus.exists ? (
                  containerStatus.running ? (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleStopContainer}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <Spinner size="sm" /> : 'Stop'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleRestartContainer}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <Spinner size="sm" /> : 'Restart'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleStartContainer}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <Spinner size="sm" /> : 'Start'}
                    </Button>
                  )
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCreateContainer}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Spinner size="sm" /> : 'Create'}
                  </Button>
                )}
              </div>
            </div>
            
            {containerStatus.exists && (
              <>
                <div className="text-sm mt-4">
                  <h4 className="font-medium mb-1">Resources</h4>
                  <ul className="space-y-1 ml-2">
                    {containerStatus.deployment && (
                      <li>Deployment: {containerStatus.deployment.name}</li>
                    )}
                    {containerStatus.service && (
                      <li>Service: {containerStatus.service.name}</li>
                    )}
                    {containerStatus.pvc && (
                      <li>Storage: {containerStatus.pvc.name}</li>
                    )}
                  </ul>
                </div>
                
                {containerStatus.pods && containerStatus.pods.length > 0 && (
                  <div className="text-sm mt-4">
                    <h4 className="font-medium mb-1">Pods</h4>
                    <ul className="space-y-2">
                      {containerStatus.pods.map((pod: any, index: number) => (
                        <li key={index} className="ml-2">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${pod.status === 'Running' && pod.ready ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span>{pod.name}</span>
                          </div>
                          <div className="text-xs ml-4 mt-1 text-gray-500">
                            Status: {pod.status} {pod.ready ? '(Ready)' : ''}
                          </div>
                          {pod.restart_count > 0 && (
                            <div className="text-xs ml-4 text-gray-500">
                              Restarts: {pod.restart_count}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No container information available.
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        <p>Container logs and detailed information are available in the Container panel at the bottom of the editor.</p>
      </div>
    </div>
  );
}
