<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/juangr4/tfg">
    <img src="public/logo.png" alt="Logo">
  </a>

<h3 align="center">What A Commerce</h3>

  <p align="center">
    What A Commerce es una aplicación web que pretende proporcionar a pequeñas empresas la opción de tener un catálogo online junto con funcionalidades básicas de compra.
    <br />
    <br />
    <a href="https://tgc-commerce.vercel.app/">Ver Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Contenido</summary>
  <ol>
    <li>
      <a href="#sobre-el-proyecto">Sobr el proyecto</a>
      <ul>
        <li><a href="#software">Software</a></li>
      </ul>
    </li>
    <li>
      <a href="#como-empezar">Como empezar</a>
      <ul>
        <li><a href="#prerequisitos">Prerequisitos</a></li>
        <li><a href="#instalación">Instalación</a></li>
      </ul>
    </li>
    <li><a href="#mejoras">Mejoras</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#contacto">Contacto</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Sobre el proyecto

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

What A Commerce es una aplicación fruto del proyecto de Trabajo de Fin de Carrera. Utiliza Next.js como Framework principal junto a varias librerias extras para complementar y facilitar el desarrollo de la misma.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



### Software

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![TailwindCSS][Tailwindcss]][Tailwindcss-url]
* [![TailwindCSS][Stripe]][Stripe-url]

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



<!-- GETTING STARTED -->
## Como empezar

En esta sección se explica como crear un entorno de desarrollo en local y como ejecutar el proyecto.

### Prerequisitos

Software necesario para ejecutar la aplicación en local.
* PostgreSQL
* Stripe-CLI
* NodeJS
* npm
* docker | podman

### Instalación

1. Clona el repositorio.
   ```sh
   git clone https://github.com/juangr4/tfg.git
   ```
2. Si usas Docker, puedes saltarte el paso 3, 4 y 5.Para lanzar la aplicación utiliza el comando `docker compose --env-file .env.example up -d` cuando hayas terminado de hacer el paso 6 o te encuentres en el mismo y necesites obtener la clave de webhook de stripe.
3. Crea una base de datos en PostgreSQL. Utiliza el nombre y los credenciales que desees y apuntalos para luego.
4. Obten la API Key que te proporciona Stripe en [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
5. Copia el contenido del archivo `.env.example` en otro archivo llamado `.env.local`
6. En este archivo, debes rellenar las diferentes variables con los valores adecuados.
   * NEXT_AUTH_SECRET: debe contener el secreto con el cual se van a cifrar los datos privados del usuario.
   * STRIPE_WEBHOOK_SECRET_KEY: debe contener la clave de webhook que se muestra por consola una vez se ejecuta stripe-cli en modo escucha. Si usaste Docker Compose en el paso 1, accede a los logs para ver la clave (`docker compose logs stripe`).
   * DATABASE_URL: contiene la url de acceso a la base de datos PostgreSQL. Esta tiene el formato `postgres://<username>:<password>@<hostname>:<port>/<database_name>`. Si has utilizado Docker Compose en el paso 1, la cadena es la siguiente `postgres://tfg:tfg@127.0.0.1:5432/tfg`
   * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Contiene la clave publicable del panel de claves de Stripe. [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
   * STRIPE_SECRET_KEY: Contiene la clave secreta del panel de claves de Stripe. [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
7. Instala todas las dependencias.
   ```sh
   npm install
   ```
8. Genera las tablas de la base de datos.
   ```sh
   npm run db:push
   ```
9. (Opcional) Pobla la base de datos con datos de prueba.
   ```sh
   npm run db:populate
   ```
10. Lanza la aplicación.
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>


<!-- ROADMAP -->
## Mejoras

- [ ] Sistema de recomendación
- [ ] Mejora en la visualización de pedidos por parte de un usuario
- [ ] Validación de correo electrónico y sistema para recuperar contraseña.
- [ ] Vista principal del panel de administrador con gráficos de las ventas.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



<!-- LICENSE -->
## Licencia

[![Next][license-shield]][license-url]

Distribuido bajo la licencia GPL-3.0. Ver el archivo `LICENSE` para más información.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



<!-- CONTACT -->
## Contacto

Juangr4 - juagarrui6@alum.us.es

Enlace al proyecto: [https://github.com/juangr4/tfg](https://github.com/juangr4/tfg)

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/badge/license-GPLv3-blue?style=for-the-badge
[license-url]: https://github.com/juangr4/tfg/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Tailwindcss]: https://img.shields.io/badge/tailwindcss-35495E?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4
[Tailwindcss-url]: https://tailwindcss.com/
[Stripe]: https://img.shields.io/badge/Stripe-35495E?style=for-the-badge&logo=stripe&logoColor=008CDD
[Stripe-url]: https://stripe.com
