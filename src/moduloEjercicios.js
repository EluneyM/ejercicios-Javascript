import basededatos from './basededatos.js';


/**
* Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
*/
export const promedioAnioEstreno = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    let anios = 0;
    let cantidad = parseInt(basededatos.peliculas.length);
    for (const pelicula of basededatos.peliculas) {
        anios += pelicula.anio;
    }
    return anios / cantidad;
};

/**
* Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
* por parametro.
* @param {number} promedio
  */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
    let peliculas = [];
    let calificaciones = basededatos.calificaciones.filter(calificacion => calificacion.puntuacion > promedio);
    let peliculasId = [];
    peliculasId = peliculasIdSinDuplicados(calificaciones, peliculasId);
    for (const peliculaId of peliculasId) {
       peliculas.push(basededatos.peliculas.find(pelicula => pelicula.id == peliculaId));
    }
    return peliculas;
};

/**
* Devuelve la lista de peliculas de un director
* @param {string} nombreDirector
*/
export const peliculasDeUnDirector = (nombreDirector) => {
    let director = basededatos.directores.find(director => director.nombre == nombreDirector);
    return basededatos.peliculas.filter(pelicula => pelicula.directores.includes(director.id));
};

/**
* Devuelve el promdedio de critica segun el id de la pelicula.
* @param {number} peliculaId
*/
export const promedioDeCriticaBypeliculaId = (peliculaId) => {
    let calificaciones = basededatos.calificaciones.filter(calificacion => calificacion.pelicula == peliculaId);
    let criticas = 0;
    for (const calificacion of calificaciones) {
        criticas += calificacion.puntuacion;
    }
    return criticas / calificaciones.length;
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
function peliculasIdSinDuplicados (calificaciones, peliculasId) {
    for (const calificacion of calificaciones) {
        if (!peliculasId.includes(calificacion.pelicula)) {
            peliculasId.push(calificacion.pelicula);
        }
    }
    return peliculasId;
}
export const obtenerPeliculasConPuntuacionExcelente = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    let calificaciones = basededatos.calificaciones.filter(calificacion => calificacion.puntuacion >= 9);
    let peliculasId = [];
    if (calificaciones.length == 0) {
       return [];
    }
    peliculasId = peliculasIdSinDuplicados(calificaciones, peliculasId);
    let peliculas = basededatos.peliculas.filter(pelicula => peliculasId.includes(pelicula.id));
    return peliculas;
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {
    let pelicula = basededatos.peliculas.find(pelicula => pelicula.nombre == nombrePelicula);
    if (!pelicula) {
        return undefined;
    }
    let calificaciones = basededatos.calificaciones.filter(calificacion => calificacion.pelicula == pelicula.id);
    pelicula.criticas = [];
    for (const calificacion of calificaciones) {
        let dataCritico = {"critico": JSON.stringify(basededatos.criticos.find(critico => critico.id == calificacion.critico)),
                            "puntuacion": calificacion.puntuacion};
        pelicula.criticas.push(dataCritico);
    }
    return pelicula;
};
