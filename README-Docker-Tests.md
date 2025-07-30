# Backend Tests with Docker

This guide explains how to run backend tests using Docker containers for consistent and isolated testing environments.

## 🐳 **Docker Test Setup**

### **Files Created:**
- `backend/Dockerfile.test` - Test-specific Docker image
- `docker-compose.test.yml` - Test environment configuration
- `scripts/test-backend-docker.sh` - Local test runner script
- `.github/workflows/backend-tests.yml` - GitHub Actions workflow

---

## 🚀 **Running Tests Locally**

### **Option 1: Using the Script (Recommended)**
```bash
# Make script executable
chmod +x ./scripts/test-backend-docker.sh

# Run tests
./scripts/test-backend-docker.sh
```

### **Option 2: Using Docker Compose Directly**
```bash
# Build and run tests
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from test-backend

# Clean up
docker-compose -f docker-compose.test.yml down -v
```

---

## 🔧 **What Happens During Testing**

### **1. Container Setup**
- **PostgreSQL Container**: Test database with isolated data
- **Backend Container**: Your application with test dependencies
- **Network**: Isolated network for container communication

### **2. Test Execution**
- **Database Migration**: Runs before tests
- **Unit Tests**: `npm run test:unit`
- **Integration Tests**: `npm run test:integration`
- **Full Test Suite**: `npm test` with coverage

### **3. Results**
- **Coverage Reports**: Available in `backend/coverage/`
- **Test Results**: Displayed in console
- **Exit Code**: 0 for success, non-zero for failure

---

## 🌍 **Environment Variables**

### **Test Database:**
```bash
DATABASE_URL=postgresql://test_cicd_user:test_cicd_password@test-postgres:5432/test_cicd_workshop
```

### **Test Environment:**
```bash
NODE_ENV=test
PORT=3001
JWT_SECRET=test-secret-key-for-docker
```

---

## 📊 **Coverage Reports**

After tests complete, coverage reports are available:
- **HTML Report**: `backend/coverage/lcov-report/index.html`
- **LCOV Report**: `backend/coverage/lcov.info`
- **Console Output**: Summary in terminal

---

## 🔄 **GitHub Actions Integration**

The workflow automatically:
1. **Builds** test containers
2. **Runs** all tests
3. **Uploads** coverage artifacts
4. **Cleans up** containers

### **Workflow Features:**
- ✅ **Docker Buildx**: Faster builds
- ✅ **Container Isolation**: Clean test environment
- ✅ **Artifact Upload**: Coverage reports preserved
- ✅ **Automatic Cleanup**: No resource leaks

---

## 🛠️ **Troubleshooting**

### **Docker Not Running**
```bash
# Start Docker Desktop or Docker daemon
sudo systemctl start docker  # Linux
# Or start Docker Desktop application
```

### **Port Conflicts**
```bash
# Check if port 5433 is in use
lsof -i :5433
# Kill process if needed
kill -9 <PID>
```

### **Container Build Issues**
```bash
# Clean Docker cache
docker system prune -a
# Rebuild without cache
docker-compose -f docker-compose.test.yml build --no-cache
```

---

## 🎯 **Benefits of Docker Testing**

- ✅ **Consistent Environment**: Same setup everywhere
- ✅ **Isolation**: No conflicts with local setup
- ✅ **Production-like**: Matches deployment environment
- ✅ **Easy Setup**: No local database installation needed
- ✅ **CI/CD Ready**: Works in GitHub Actions

---

## 📝 **Next Steps**

1. **Run tests locally** to verify setup
2. **Push to GitHub** to trigger CI/CD pipeline
3. **Check Actions tab** for test results
4. **Download coverage** artifacts for analysis 