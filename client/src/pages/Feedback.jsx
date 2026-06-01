import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');
          .feedback-page {
            font-family: 'DM Sans', sans-serif;
            min-height: calc(100vh - 130px);
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
          }
          .success-box {
            text-align: center;
            max-width: 420px;
          }
          .success-icon {
            width: 56px;
            height: 56px;
            background: #111827;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .success-title {
            font-family: 'Sora', sans-serif;
            font-size: 1.4rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 10px;
          }
          .success-desc {
            font-size: 0.92rem;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 28px;
          }
          .home-btn {
            padding: 11px 28px;
            background: #111827;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-family: 'Sora', sans-serif;
            font-weight: 700;
            font-size: 0.875rem;
            cursor: pointer;
            transition: background 0.15s;
          }
          .home-btn:hover { background: #1d4ed8; }
        `}</style>
        <div className="feedback-page">
          <div className="success-box">
            <div className="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="success-title">Thank you for your feedback!</div>
            <div className="success-desc">
              Your response helps us improve DebateGpt and make AI debates
              more meaningful for everyone.
            </div>
            <button className="home-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .feedback-page {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 130px);
          background: #fff;
          padding: 60px 24px 80px;
          box-sizing: border-box;
        }

        .feedback-inner {
          max-width: 520px;
          margin: 0 auto;
        }

        .feedback-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          text-align: center;
          margin-bottom: 32px;
        }

        .feedback-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 32px;
        }

        .rating-label {
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        /* Star rating */
        .stars-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 8px;
        }

        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.1s;
          outline: none;
        }

        .star-btn:hover { transform: scale(1.15); }

        .star-svg {
          width: 32px;
          height: 32px;
          transition: fill 0.15s, stroke 0.15s;
        }

        .star-filled { fill: #111827; stroke: #111827; }
        .star-empty  { fill: none; stroke: #d1d5db; stroke-width: 1.5; }

        .rating-text {
          text-align: center;
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 24px;
          min-height: 18px;
        }

        /* Textarea */
        .feedback-textarea {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px 14px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #fff;
          outline: none;
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }

        .feedback-textarea:focus { border-color: #111827; }
        .feedback-textarea::placeholder { color: #9ca3af; }

        .error-msg {
          font-size: 0.78rem;
          color: #ef4444;
          margin-top: 8px;
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #111827;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.15s, transform 0.12s;
          letter-spacing: 0.01em;
        }

        .submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .submit-btn:active { transform: translateY(0); }

        .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
      `}</style>

      <div className="feedback-page">
        <div className="feedback-inner">

          <h1 className="feedback-title">We Value Your Feedback</h1>

          <div className="feedback-card">

            {/* Star rating */}
            <div className="rating-label">Rate the AI's Performance</div>

            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="star-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <svg
                    className="star-svg"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon
                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                      className={
                        (hovered || rating) >= star ? "star-filled" : "star-empty"
                      }
                    />
                  </svg>
                </button>
              ))}
            </div>

            <div className="rating-text">
              {hovered === 1 && "Poor"}
              {hovered === 2 && "Fair"}
              {hovered === 3 && "Good"}
              {hovered === 4 && "Very Good"}
              {hovered === 5 && "Excellent!"}
              {!hovered && rating === 1 && "Poor"}
              {!hovered && rating === 2 && "Fair"}
              {!hovered && rating === 3 && "Good"}
              {!hovered && rating === 4 && "Very Good"}
              {!hovered && rating === 5 && "Excellent!"}
              {!hovered && rating === 0 && "Select a rating"}
            </div>

            <hr className="divider" />

            {/* Text feedback */}
            <textarea
              className="feedback-textarea"
              placeholder="Share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button className="submit-btn" onClick={handleSubmit}>
              Submit Feedback
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
