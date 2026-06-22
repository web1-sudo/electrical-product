// FORGOT PASSWORD PAGE

exports.forgotPasswordPage = (req, res) => {
  res.render("admin/forgot-password");
};

// FORGOT PASSWORD

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.send("Email is required");
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      if (results.length === 0) {
        return res.send("Email not found");
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 3600000);

      db.query(
        `UPDATE users
         SET reset_token = ?, reset_token_expiry = ?
         WHERE email = ?`,
        [token, expiry, email],
        async (err) => {
          if (err) {
            console.log(err);
            return res.send("Database Error");
          }

          try {
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
                <h2>Reset Password</h2>
                <p>Click the button below to reset your password.</p>
                <a href="${resetLink}">
                  Reset Password
                </a>
              `,
            });

            res.send("Password reset link sent successfully");
          } catch (error) {
            console.log(error);
            res.send("Email sending failed");
          }
        }
      );
    }
  );
};