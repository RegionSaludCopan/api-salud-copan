/**
 * Archivo para definir metodos de acceso a la base de datos de MongoDB
 * Para manipular los registros de la coleccion de Archivos
 *
 * Autor: USAID - Proyecto Avanzando por la Salud de Honduras
 * Fecha: Junio 2023
 * Versión: 1.0.0
 */

import Archivo from "../models/archivo.js";

export async function publicarArchivos(stringArchivos){
  let mongoArchivos = [];
  const archivos = JSON.parse(stringArchivos);

  for (let i = 0; i < archivos.length; i++) {
    const archivo = new Archivo({
      tipo: determinarTipo(archivos[i].nombre),
      nombre: archivos[i].nombre,
      enlace: archivos[i].enlace
    });
    await archivo.save();

    mongoArchivos = mongoArchivos.concat(archivo);
  }

  return mongoArchivos;
}

/**
 * Obtiene el tipo de un archivo enviado en base a su extension de nombre
 * @param {string} nombreArchivo El nombre del archivo enviado
 * @returns Retorna un string con el tipo de archivo 
 */
function determinarTipo(nombreArchivo){
  //Evita el proceso logico al no tener un nombre de archivo
  if(!nombreArchivo) return "";
  
  //Extensiones fijas para cada tipo de archivo
  const extensionesDocumento = ["doc", "docx", "pdf", "xls", "xlsx", "xlsm", "ppt", "pptx"];
  const extensionesImagen = ["img", "png", "jpg", "jpeg", "gif"];
  const extensionesVideo = ["mp4", "mpeg4", "avi", "wmv", "mov", "3gp", "3gpp"];

  //Se obtiene la terminacion del nombre de archivo luego del punto.
  const extension = nombreArchivo.split('.').pop();

  //Se compara la extension de archivo con los diferentes grupos de extensiones
  if(extensionesDocumento.includes(extension)) {
    return 'Documento';
  }

  if(extensionesImagen.includes(extension)) {
    return 'Imagen';
  }

  if(extensionesVideo.includes(extension)) {
    return 'Video';
  }

  //Si se envia un archivo no vacio, pero que no tiene ningun de las extensiones permitidas
  return "No válido";
}