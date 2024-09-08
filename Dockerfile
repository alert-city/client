# 使用指定版本官方 Node.js 镜像
FROM node:20.10.0-alpine

# 设置工作目录
WORKDIR /app

# 定义构建时的环境变量
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_REST_API_URL
ARG NEXT_PUBLIC_WEBSOCKET_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制所有文件
COPY . .

#COPY .env.production .env.development

# 设置生产环境
ENV NODE_ENV=production


RUN NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_REST_API_URL=${NEXT_PUBLIC_REST_API_URL} \
    NEXT_PUBLIC_WEBSOCKET_URL=${NEXT_PUBLIC_WEBSOCKET_URL} \
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY} \
    yarn run build

RUN echo "API_URL: $NEXT_PUBLIC_API_URL" && \
    echo "REST_API_URL: $NEXT_PUBLIC_REST_API_URL" && \
    echo "WEBSOCKET_URL: $NEXT_PUBLIC_WEBSOCKET_URL" && \
    echo "RECAPTCHA_SITE_KEY: $NEXT_PUBLIC_RECAPTCHA_SITE_KEY"

### 构建应用
#RUN yarn run build

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["yarn", "start"]
