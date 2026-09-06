import { registerUser } from "../services/authService.js";

export async function register(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await registerUser(email, password);

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({ error: "An account with this email already exists." });
    } else {
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
}