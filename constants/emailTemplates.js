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
}

module.exports = EMAIL_TEMPLATES