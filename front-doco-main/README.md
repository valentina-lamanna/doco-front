**Local**

asegurar estar parado sobre doco y ejecutar
`npm run dev`
con ese comando se corre los cambios

**Docker**

Comando para instalar las liberias (Solo la primera vez a menos que se cambie la imagen)

`docker build . -t doco_front`

Para levantar la pagina correr
`docker-compose up -d`

Luego ir a 'http://localhost:3000/'

Para listar las imagenes de docker
`docker images`

Para ver el contenido de la imagen por comando
`docker run -it doco-front sh`

Si el docker te rompe mal usar a criterio OJOO hace limpieza de cache
`docker system prune -f`

Para ver el contenedor por dentro en WINDOWSSS!!
`docker exec -it doco-front /bin/sh`


## SUbir la imagen al registry
cuando hacemos merge a dev (avisenle a valen que suba la nueva imagen)

1.  docker login docoacr.azurecr.io
2.  docker build . -t docoacr.azurecr.io/doco_front
3. docker push docoacr.azurecr.io/doco_front
