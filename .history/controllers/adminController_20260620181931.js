exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  const expiry = new Date(Date.now() + 3600000);

  db.query(
    `UPDATE users
     SET reset_token=?, reset_token_expiry=?
     WHERE email=?`,
    [token, expiry, email],
    async (err) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink =
        `http://localhost:3000/admin/reset-password/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: `
          <h3>Reset Password</h3>
          <a href="${resetLink}">
            Click Here To Reset Password
          </a>
        `,
      });

      res.send("Password reset link sent.");
    }
  );
};