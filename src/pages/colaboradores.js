// pages/colaboradores.js
import React from 'react';
export const colaboradores = [
  { nombre: 'ANGELICA MARCELA AGUILAR HARDY', rut: '14.446.321-8', area: 'SPR', correo: 'aaguilarhardy@hotmail.com', celular: '56963677047' },
  { nombre: 'CAMILA ALEJANDRA CARRIZO JIMENEZ', rut: '19.619.992-6', area: 'ADMISION', correo: 'ccarrizoji@gmail.com', celular: '56986966977' },
  { nombre: 'CARLA PAOLA PEREZ BARRIOS', rut: '15.102.022-4', area: 'SPR', correo: 'carla.perez.barrios@gmail.com', celular: '56983434436' },
  { nombre: 'CAROLINA ANDREA FIGUEROA GONZALEZ', rut: '16.352.118-0', area: 'ADMINISTRACION Y CALIDAD', correo: 'carolina.figo@gmail.com', celular: '56993380818' },
  { nombre: 'DANIELA FERNANDA GONZALEZ OSORIO', rut: '18.121.885-1', area: 'SPR', correo: 'dfernandago@gmail.com', celular: '56945010381' },
  { nombre: 'FABIÁN IGNACIO TOBAR MUÑOZ', rut: '18.609.389-5', area: 'MARKETING Y SISTEMAS', correo: 'fabian.tobar.m@hotmail.cl', celular: '56991709265' },
  { nombre: 'FERNANDA VICTORIA ZARATE RAMIREZ', rut: '16.899.936-4', area: 'SPR', correo: 'Zarateramirezfernanda@gmail.com', celular: '56942719153' },
  { nombre: 'JACQUELINE DEL CARMEN CONTRERAS PAILLAN', rut: '10.344.322-9', area: 'SPR', correo: 'jcontrerasp80@gmail.com', celular: '56972412445' },
  { nombre: 'JAVIERA VALENTINA ROCO PAREDES', rut: '19.679.418-2', area: 'ADMISION', correo: 'roco.javierap@gmail.com', celular: '56971295800' },
  { nombre: 'JOCELYN ALEJANDRA SOLIS HERNANDEZ', rut: '14.197.031-3', area: 'ADMISION', correo: 'Jocelynsolis.h@gmail.com', celular: '56999623032' },
  { nombre: 'JUAN PABLO ANDRÉS PIZARRO MARTÍNEZ', rut: '16.244.610-k', area: 'COORDINACION ACADEMICA', correo: 'jpa.pizarro@gmail.com', celular: '56941116521' },
  { nombre: 'MARIA PAOLA VALDIVIA RINCÓN', rut: '17.947.531-6', area: 'ADMISION', correo: 'paolavaldivia12@gmail.com', celular: '56972813188' },
  { nombre: 'MARISEL EUGENIA MANRIQUEZ MORENO', rut: '17.305.844-6', area: 'ADMISION', correo: 'manriquez.marisel@gmail.com', celular: '56988170516' },
  { nombre: 'MAXIMILIANO ANDRES RESTOVIC MAJLUF', rut: '15.657.156-3', area: 'GERENCIA', correo: 'maxirestovic@gmail.com', celular: '56981402388' },
  { nombre: 'MONICA STEFANY HUERTA SANTANDER', rut: '18.316.148-2', area: 'ADMISION', correo: 'mhuerta2192@gmail.com', celular: '56935818642' },
  { nombre: 'PATRICIA ODETTE VALDEBENITO BARRA', rut: '11.078.121-0', area: 'SPR', correo: 'patricia.lanona1@gmail.com', celular: '56976356440' },
  { nombre: 'SABRINA ELOISA ZAMBRANO MIRANDA', rut: '18.319.251-5', area: 'COORDINACION ACADEMICA', correo: 'sabrinaeloisaz@gmail.com', celular: '56944130925' },
  { nombre: 'SANDRA XIMENA VASQUEZ NIETO', rut: '11.261.313-7', area: 'RRHH', correo: 'sandrav68@gmail.com', celular: '56976179117' },
  { nombre: 'STEPHANIA JASMIN BILBAO LA VIEJA PEÑARANDA', rut: '14.758.357-5', area: 'MARKETING Y SISTEMAS', correo: 'stephaniabilbao@gmail.com', celular: '56949440138' },
  { nombre: 'CATALINA ANDREA VIVEROS SANCHEZ', rut: '20.735.514-3', area: 'MARKETING Y SISTEMAS', correo: 'CATALINAANDREA0110@GMAIL.COM', celular: '56953109111' },
];
export default function ColaboradoresPage() {
  return (
    <div>
      <h1>Colaboradores</h1>
      <ul>
        {colaboradores.map((col, idx) => (
          <li key={idx}>
            {col.nombre} - {col.area}
          </li>
        ))}
      </ul>
    </div>
  );
}