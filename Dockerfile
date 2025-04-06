FROM node:20.18-alpine

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ENV NODE_OPTIONS="--max-old-space-size=8192"

# --- Define a variável de ambiente de fuso horário ---
RUN apk add --no-cache openssl bash tzdata
ENV TZ="America/Sao_Paulo"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package.json .

RUN npm install

# Add a non-root user and change ownership of the app directory
# RUN adduser -D myuser && chown -R myuser:myuser /app ./node_modules/

# Switch to the non-root user
# USER myuser

COPY . .

# RUN chown -R myuser:myuser ./node_modules/

RUN npm run prisma:generate

RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]

