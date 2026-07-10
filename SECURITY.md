# Política de seguridad — SN-Bot

Nos tomamos muy en serio la seguridad. Si detectas alguna vulnerabilidad, te rogamos que sigas la política que se indica a continuación para que podamos evaluarla y solucionarla de forma segura.

## Resumen / Aclaraciones sobre el autoalojamiento
SN-Bot se distribuye como software de código abierto para su autoalojamiento. Nosotros (los responsables del mantenimiento) no gestionamos instancias autoalojadas y no tenemos acceso a los datos ni a las configuraciones de los usuarios en implementaciones de terceros. Los usuarios que autoalojan el software son responsables de la seguridad y el funcionamiento de sus instancias. Esta política describe cómo informar de vulnerabilidades que afecten al código del proyecto y ofrece orientación a los usuarios que autoalojan el software y descubran problemas de seguridad en su implementación.

## Notificación de una vulnerabilidad (opción preferida)
- Canal preferido: abre un aviso de seguridad privado en GitHub para este repositorio (recomendado).
- Si no puedes utilizar los avisos de GitHub, abre un ticket: https:
- NO abras una incidencia pública con detalles sobre cómo explotar la vulnerabilidad.

Si has detectado un problema en tu instancia autohospedada que parece deberse a una configuración incorrecta, ponte en contacto primero con el operador o proveedor de la instancia. Si crees que el problema se debe a una vulnerabilidad en el código de SN-Bot, sigue los pasos para informar de ello que se indican más arriba e indica si el informe procede de una implementación autohospedada.

## Plazos de respuesta (qué se puede esperar)
- Acuse de recibo: en un plazo de 72 horas.
- Clasificación y estimación de la gravedad: en un plazo de 7 días.
- Plan de corrección o migración:
  - Crítico: el objetivo es implementar la corrección o la medida de mitigación en un plazo de 7 a 14 días.
  - Alto: el objetivo es implementarla en un plazo de 30 días.
  - Media/Baja: se abordará en una versión futura; se comunicará en un plazo de 90 días.
- Divulgación pública: coordinaremos con la persona que haya informado del problema y, normalmente, publicaremos un aviso tras el lanzamiento del parche, o en un plazo de 90 días si no se ha resuelto (a menos que la persona que haya informado del problema solicite lo contrario).

## Normas de pruebas seguras (normas de actuación para investigadores)
- Realiza pruebas únicamente en servicios de los que seas propietario o para los que tengas permiso explícito.
- No extraigas, destruyas ni modifiques datos de los usuarios.
- No intentes obtener acceso a tokens de usuario de Discord, mensajes directos (DM) u otro contenido privado de los usuarios, ni escalar privilegios para acceder a ellos.
- Proporciona una prueba de concepto (PoC) mínima y segura que reproduzca el problema. Oculta los datos sensibles (tokens, información de identificación personal).
- Si la vulnerabilidad requiere pruebas intrusivas, ponte en contacto con nosotros primero para acordar un plan.

## Qué incluir en tu informe
- Componente afectado (p. ej., migración de la base de datos, analizador de comandos, OAuth).
- Pasos claros y mínimos para reproducir el problema.
- Entorno: SHA del commit, etiqueta de la versión, etiqueta de la imagen de Docker o versión.
- Si el problema se observó en una implementación autohospedada (y la configuración de dicha implementación).
- Prueba de concepto (PoC) (script, solicitud HTTP, registros, capturas de pantalla): elimina los datos confidenciales antes de compartirlos.
- Impacto (exposición de datos, escalada de privilegios, ejecución remota de código [RCE], etc.).
- Medidas de mitigación sugeridas (si las hay).
- Datos de contacto para el seguimiento.

## Notificación de incidentes en implementaciones autohospedadas
Si gestionas una instancia autohospedada de SN-Bot y sufres un incidente de seguridad:
- Renueva inmediatamente cualquier dato confidencial expuesto (token del bot, credenciales de la base de datos, claves de API).
- Realiza una instantánea de los registros y la configuración para la investigación (evita compartir datos confidenciales).
- Si necesitas ayuda del equipo de desarrollo, envía un aviso de seguridad privado e incluye los pasos de reproducción anonimizados, así como la versión y el commit de SN-Bot.
- Los mantenedores solo pueden corregir vulnerabilidades en el código del proyecto original; no podemos rotar tokens, restaurar datos ni solucionar problemas en implementaciones de otros hosts.

## Ámbito de aplicación
- Incluido: el código de este repositorio, los flujos de autenticación, los webhooks proporcionados por este proyecto y los artefactos de implementación previstos (archivos Dockerfile, scripts).
- Fuera del ámbito: servicios de terceros (el propio Discord, proveedores de bases de datos alojadas) e instancias de las que no seas propietario sin el consentimiento del propietario.

## Consejos de mantenimiento y refuerzo de seguridad para usuarios con alojamiento propio (configuración predeterminada recomendada)
- Utiliza TLS para todos los puntos de conexión expuestos y los webhooks (Let’s Encrypt es una buena opción).
- No expongas Postgres a la red pública de Internet. Utiliza una red interna, una VPC o túneles SSH.
- Ejecuta Postgres con autenticación, contraseñas seguras y restricciones de red.
- Mantén los secretos fuera del repositorio (utiliza variables de entorno, gestores de secretos o GitHub Secrets para la integración continua).
- Limita las intenciones y los permisos del bot en Discord al mínimo necesario.
- Activa las actualizaciones automáticas de dependencias (Dependabot) y las alertas de seguridad.
- Activa el escaneo de secretos para tus repositorios y habilita la protección contra envíos si está disponible.
- Renueva los tokens del bot y las claves API cuando se sospeche que han sido comprometidos.
- Realiza copias de seguridad periódicas de Postgres y comprueba las restauraciones con regularidad.
- Supervisa los registros y activa alertas ante actividades sospechosas (cambios inesperados en la configuración, eliminaciones masivas).

## Divulgación y créditos
- Daremos crédito a los investigadores en las notas de lanzamiento o avisos, a menos que solicites el anonimato.
- Podemos asignar un CVE o coordinarnos con CERT u otros organismos para incidencias de alta gravedad.

## Privacidad y telemetría
- SN-Bot no se comunica con el servidor central ni recopila datos de uso de forma predeterminada. (Si tiene previsto añadir telemetría, debe ser opcional, estar documentada y ser transparente).
- Los mantenedores no reciben datos de las instancias autohospedadas. Si decide habilitar cualquier tipo de telemetría, documente qué datos se recopilan y cómo darse de baja.

