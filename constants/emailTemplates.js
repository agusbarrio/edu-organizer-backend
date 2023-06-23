'use strict'

const EMAIL_TEMPLATES = {
    VERIFY_ACCOUNT: {
        key: 'VERIFY_ACCOUNT',
        subject: 'Verificación de cuenta - EduOrganizer',
        html: `
            <h1>Verificá tu cuenta</h1>
            <p><a href="{{url}}">Verificar</a></p>
            <p>Si no has solicitado este registro, por favor ignora este correo.</p>
        `,
    },
    RECOVER_PASSWORD: {
        key: 'RECOVER_PASSWORD',
        subject: 'Recuperar contraseña - EduOrganizer',
        html: `
            <h1>Recuperar contraseña</h1>
            <p>Para recuperar tu contraseña hacé click en el siguiente enlace</p>
            <p><a href="{{url}}">Reiniciar contraseña</a></p>
            <p>Si no solicitaste recuperar tu contraseña, por favor ignora este correo</p>
        `,
    },
}

module.exports = EMAIL_TEMPLATES