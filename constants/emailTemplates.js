'use strict'

const EMAIL_TEMPLATES = {
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
    COMPLETE_ACCOUNT: {
        key: 'COMPLETE_ACCOUNT',
        subject: 'Completá tu cuenta - EduOrganizer',
        html: `
            <h1>Completá tu cuenta</h1>
            <p>Un administrador te invitó a EduOrganizer.</p>
            <p>Para completar tu cuenta y definir tu contraseña, hacé click en el siguiente enlace:</p>
            <p><a href="{{url}}">Completar cuenta</a></p>
            <p>Si no esperabas este correo, podés ignorarlo.</p>
        `,
    },
}

module.exports = EMAIL_TEMPLATES