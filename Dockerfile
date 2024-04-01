FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

#ENV PGHOST postgres-container
#ENV PGHOST postgres-container
#ENV PGDATABASE growth_db
#ENV PGUSER growth_user
#ENV PGPASSWORD growth_password
#ENV PGPORT 5432

CMD ["npm", "run", "prod"]