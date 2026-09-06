import { registerUser, loginUser } from "../services/authService.js";

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

export async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const token = await loginUser(email, password);
  
      res.status(200).json({ token: token });
    } catch (error) {
      if (error.message === "INVALID_CREDENTIALS") {
        res.status(401).json({ error: "Invalid email or password." });
      } else {
        res.status(500).json({ error: "Something went wrong. Please try again." });
      }
    }
  }