exports.login = (req, res) => {
  console.log("ADMIN LOGIN HIT");
  console.log("FORM DATA:", req.body);

  const { email, password } = req.body;

  User.findUserByEmail(email, async (err, results) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.send("Database Error");
    }

    console.log("USER RESULT:", results);

    if (results.length > 0) {
      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      console.log("PASSWORD MATCH:", match);

      if (match) {
        req.session.user = user;

        return res.redirect("/admin/dashboard");
      } else {
        return res.send("Invalid Password");
      }
    } else {
      return res.send("User Not Found");
    }
  });
};