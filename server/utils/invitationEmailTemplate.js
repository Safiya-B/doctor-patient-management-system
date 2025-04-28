exports.getInvitationEmailTemplate = (invitationUrl) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <title>Account Invitation</title>
</head>

<body>
    <h1>Welcome to Dr. Johnson's Practice</h1>
    <p>
        An account has been created for you. Click the link below to set up your password and access your account:
    </p>
    <a href="${invitationUrl}" target="_blank">Set Up Your Password</a>
    <p>If you did not expect this email, please ignore it.</p>
</body>

</html>
`;
};
