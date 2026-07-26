import transporter from "../config/mailer.js";

export const sendFeedback = async (req, res) => {
  try {
    const {
      name,
      email,
      feedback,
      rating,
    } = req.body;

    if (!feedback || !rating) {
      return res.status(400).json({
        success: false,
        message: "Feedback and rating are required",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: "shaunak206107@gmail.com",

      replyTo: email || process.env.EMAIL_USER,

      subject: `New FurEver Customer Feedback - ${rating}/5 Stars`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">

          <h2 style="color: #14172E;">
            New FurEver Customer Feedback
          </h2>

          <hr />

          <p>
            <strong>Customer Name:</strong>
            ${name || "Not provided"}
          </p>

          <p>
            <strong>Customer Email:</strong>
            ${email || "Not provided"}
          </p>

          <p>
            <strong>Rating:</strong>
            ${"⭐".repeat(Number(rating))}
          </p>

          <h3>Feedback:</h3>

          <p style="
            background-color: #f8f5ef;
            padding: 15px;
            border-radius: 10px;
          ">
            ${feedback}
          </p>

          <hr />

          <p style="color: #777;">
            This feedback was submitted through the FurEver website.
          </p>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Feedback sent successfully",
    });

  } catch (error) {

    console.log("Send Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send feedback",
    });
  }
};