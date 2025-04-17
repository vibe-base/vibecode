FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the original frontend files
COPY --from=gigahard/vibecode-frontend:latest /usr/share/nginx/html /usr/share/nginx/html

# Rename the original index.html
RUN mv /usr/share/nginx/html/index.html /usr/share/nginx/html/index-original.html

# Copy the patched index.html
COPY index.html /usr/share/nginx/html/index.html

# Create a directory for the patch script
RUN mkdir -p /usr/share/nginx/html/patch

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
