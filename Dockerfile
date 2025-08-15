# Use official MongoDB image as base
FROM mongo:latest

# Environment variables for root user
ENV MONGO_INITDB_ROOT_USERNAME=admin \
    MONGO_INITDB_ROOT_PASSWORD=secret

# Expose default MongoDB port
EXPOSE 27017

# Default command to run when container starts
CMD ["mongod"]
