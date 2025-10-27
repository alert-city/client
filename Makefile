# ============================================
# Alert City Web (Next.js) Makefile
# ============================================
.PHONY: help build up down restart deploy logs status clean redeploy shell

# ===== 配置变量 =====
PROJECT_NAME=alertcity-client
COMPOSE_FILE=docker-compose.alertcity.yml
ENV_FILE=.env.production

# ✅ 从 .env.production 读取配置
include $(ENV_FILE)
export

# ===== 应用部署命令 =====

# 构建镜像
build:
	@echo "🔨 构建 Alert City Client 镜像..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) build --build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) --build-arg NEXT_PUBLIC_REST_API_URL=$(NEXT_PUBLIC_REST_API_URL) --build-arg NEXT_PUBLIC_WEBSOCKET_URL=$(NEXT_PUBLIC_WEBSOCKET_URL) --build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$(NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
	@echo "✅ 构建完成"

# 启动服务
up:
	@echo "🚀 启动 Alert City Client 服务..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d
	@echo "✅ 服务启动完成"
	@$(MAKE) status

# 停止服务
down:
	@echo "🛑 停止 Alert City Client 服务..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down
	@echo "✅ 服务已停止"

# 重启服务
restart: down up

# 完整部署（构建并启动）
deploy: build up
	@echo ""
	@echo "✅ Alert City Client 部署成功！"
	@echo "🌐 访问地址: http://localhost:55007"
	@echo ""
	@echo "查看日志: make logs"
	@echo "查看状态: make status"

# 重新构建并部署
redeploy: clean deploy

# ===== 日志查看 =====

# 查看日志
logs:
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) logs -f

# 查看最后 100 行日志
tail:
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) logs --tail=100

# ===== 状态和管理 =====

# 查看服务状态
status:
	@echo "📊 Alert City Client 服务状态:"
	@echo ""
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "容器详情:"
	@docker ps --filter "name=alertcity-web" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 进入容器
shell:
	@echo "🔧 进入 Client 容器..."
	docker exec -it alertcity-web sh

# ===== 清理和维护 =====

# 清理服务
clean:
	@echo "🗑️  清理 Alert City Client 服务..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down -v
	docker rmi alertcity-web:latest 2>/dev/null || true
	@echo "✅ 清理完成"

# ===== 帮助信息 =====

help:
	@echo "Alert City Web 部署命令:"
	@echo ""
	@echo "🚀 应用部署:"
	@echo "  make deploy              - 构建并部署服务"
	@echo "  make build               - 只构建镜像"
	@echo "  make up                  - 只启动服务"
	@echo "  make down                - 停止服务"
	@echo "  make restart             - 重启服务"
	@echo "  make redeploy            - 清理并重新部署"
	@echo ""
	@echo "📋 日志查看:"
	@echo "  make logs                - 查看实时日志"
	@echo "  make tail                - 查看最后 100 行日志"
	@echo ""
	@echo "📊 状态和管理:"
	@echo "  make status              - 查看服务状态"
	@echo "  make shell               - 进入容器"
	@echo ""
	@echo "🗑️  清理:"
	@echo "  make clean               - 清理服务和镜像"
	@echo ""
	@echo "📝 完整部署流程:"
	@echo "  1. 首次部署:"
	@echo "     make deploy"
	@echo ""
	@echo "  2. 后续更新:"
	@echo "     make redeploy"

# 默认目标
.DEFAULT_GOAL := help

# ===== 快捷命令别名 =====
start: up
stop: down
log: logs
ps: status