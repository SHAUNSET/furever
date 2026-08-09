import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
  generateToken,
  generateAdminToken,
} from "../config/token.js";


// ======================================================
// COOKIE OPTIONS
// ======================================================

const isProduction =
  process.env.NODE_ENV === "production";


const cookieOptions = {

  httpOnly: true,

  secure:
    isProduction,

  sameSite:
    isProduction
      ? "none"
      : "lax",

};


// ======================================================
// REGISTER USER
// ======================================================

export const registeration = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;


    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name, email and password are required",

      });

    }


    const trimmedName =
      name.trim();


    const trimmedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !validator.isEmail(
        trimmedEmail
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email",

      });

    }


    if (
      password.length < 6
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Password must be at least 6 characters",

      });

    }


    // -------------------------------
    // CHECK EXISTING USER
    // -------------------------------

    const existingUser =
      await User.findOne({

        email:
          trimmedEmail,

      });


    if (
      existingUser
    ) {

      return res.status(409).json({

        success: false,

        message:
          "User already exists",

      });

    }


    // -------------------------------
    // HASH PASSWORD
    // -------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // -------------------------------
    // CREATE USER
    // -------------------------------

    const user =
      await User.create({

        name:
          trimmedName,

        email:
          trimmedEmail,

        password:
          hashedPassword,

      });


    // -------------------------------
    // GENERATE TOKEN
    // -------------------------------

    const token =
      generateToken(
        user._id
      );


    // -------------------------------
    // SET COOKIE
    // -------------------------------

    res.cookie(
      "token",
      token,
      {

        ...cookieOptions,

        maxAge:
          1000 *
          60 *
          60,

      }
    );


    // -------------------------------
    // RESPONSE
    // -------------------------------

    return res.status(201).json({

      success: true,

      message:
        "Registration Successful",

      token,

      user: {

        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

      },

    });

  }

  catch (
    error
  ) {

    console.log(
      "Registration Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

    });

  }

};


// ======================================================
// LOGIN
// ======================================================

export const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and Password are required",

      });

    }


    const trimmedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !validator.isEmail(
        trimmedEmail
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Email",

      });

    }


    // -------------------------------
    // FIND USER
    // -------------------------------

    const user =
      await User.findOne({

        email:
          trimmedEmail,

      });


    if (
      !user
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid Credentials",

      });

    }


    // -------------------------------
    // CHECK PASSWORD
    // -------------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (
      !isMatch
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid Credentials",

      });

    }


    // -------------------------------
    // GENERATE TOKEN
    // -------------------------------

    const token =
      generateToken(
        user._id
      );


    // -------------------------------
    // SET COOKIE
    // -------------------------------

    res.cookie(
      "token",
      token,
      {

        ...cookieOptions,

        maxAge:
          1000 *
          60 *
          60,

      }
    );


    // -------------------------------
    // RESPONSE
    // -------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Login Successful",

      token,

      user: {

        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

      },

    });

  }

  catch (
    error
  ) {

    console.log(
      "Login Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

    });

  }

};


// ======================================================
// LOGOUT
// ======================================================

export const logout = (
  req,
  res
) => {

  try {

    // -------------------------------
    // CLEAR USER COOKIE
    // -------------------------------

    res.clearCookie(
      "token",
      cookieOptions
    );


    // -------------------------------
    // CLEAR ADMIN COOKIE
    // -------------------------------

    res.clearCookie(
      "adminToken",
      cookieOptions
    );


    // -------------------------------
    // RESPONSE
    // -------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Logout Successful",

    });

  }

  catch (
    error
  ) {

    console.log(
      "Logout Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

    });

  }

};


// ======================================================
// GOOGLE LOGIN
// ======================================================

export const googleLogin = async (
  req,
  res
) => {

  console.log(
    req.body
  );


  try {

    const {
      name,
      email,
    } = req.body;


    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (
      !name ||
      !email
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name and Email are required",

      });

    }


    const trimmedName =
      name.trim();


    const trimmedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !validator.isEmail(
        trimmedEmail
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Email",

      });

    }


    // -------------------------------
    // FIND EXISTING USER
    // -------------------------------

    let user =
      await User.findOne({

        email:
          trimmedEmail,

      });


    // -------------------------------
    // CREATE USER IF NOT EXISTS
    // -------------------------------

    if (
      !user
    ) {

      const randomPassword =
        crypto
          .randomBytes(32)
          .toString("hex");


      const hashedPassword =
        await bcrypt.hash(
          randomPassword,
          10
        );


      user =
        await User.create({

          name:
            trimmedName,

          email:
            trimmedEmail,

          password:
            hashedPassword,

        });

    }


    // -------------------------------
    // GENERATE TOKEN
    // -------------------------------

    const token =
      generateToken(
        user._id
      );


    console.log(
      "Google User ID:",
      user._id
    );


    console.log(
      "Generated Token:",
      token
    );


    // -------------------------------
    // SET COOKIE
    // -------------------------------

    res.cookie(
      "token",
      token,
      {

        ...cookieOptions,

        maxAge:
          1000 *
          60 *
          60,

      }
    );


    // -------------------------------
    // RESPONSE
    // -------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Google Login Successful",

      token,

      user: {

        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

      },

    });

  }

  catch (
    error
  ) {

    console.log(
      "Google Login Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

    });

  }

};


// ======================================================
// ADMIN LOGIN
// ======================================================

export const adminLogin = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and Password are required",

      });

    }


    // -------------------------------
    // CHECK ADMIN CREDENTIALS
    // -------------------------------

    if (

      email !==
        process.env.ADMIN_EMAIL ||

      password !==
        process.env.ADMIN_PASSWORD

    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid Admin Credentials",

      });

    }


    // -------------------------------
    // GENERATE ADMIN TOKEN
    // -------------------------------

    const token =
      generateAdminToken();


    // -------------------------------
    // SET ADMIN COOKIE
    // -------------------------------

    res.cookie(
      "adminToken",
      token,
      {

        ...cookieOptions,

        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,

      }
    );


    // -------------------------------
    // RESPONSE
    // -------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Admin Login Successful",

      token,

    });

  }

  catch (
    error
  ) {

    console.error(
      "Admin Login Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

    });

  }

};
