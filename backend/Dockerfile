# Multi-stage build for Spring Boot
FROM maven:3.9-eclipse-temurin-11-alpine AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
# RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:11-jre-alpine

WORKDIR /app

# Copy WAR from build stage
COPY --from=build /app/target/*.war app.war

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.war"]
