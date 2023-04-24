'use strict'

const EMAIL_TEMPLATES = {
    //Email que el super admin envia a un usuario para que pueda registrar su organizacion
    SUPER_ADMIN_INVITE: {
        key: 'SUPER_ADMIN_INVITE',
        subject: 'Invitación a EduOrganizer',
        html: `
            <p>Hola {{name}},</p>
            <p>Has sido invitado a registrarte en EduOrganizer.</p>
            <p>Para completar el registro, haz click en el siguiente enlace:</p>
            <p><a href="{{url}}">{{url}}</a></p>
            <p>Si no has solicitado este registro, por favor ignora este correo.</p>
            <p>Saludos,</p>
            <p>El equipo de EduOrganizer</p>
        `,
    },
}

module.exports = EMAIL_TEMPLATES