import React, { useState, useEffect } from "react";
import { getItinerary } from "./apis/getitinerary";
import { getPointsOfInterest } from "./apis/getpoints";
import getdata from "./apis/getdata";
import axios from "axios";
import { EmailShareButton, WhatsappShareButton } from "react-share";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Inputtt() {
  const [request, setRequest] = useState({ days: "", city: "" });
  const [itinerary, setItinerary] = useState("");
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [daysArray, setDaysArray] = useState([]);
  const [sharedContent, setSharedContent] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    checkRedirect();
    fetchRecentSearches();
  }, []);

  function checkRedirect() {
    if (window.location.hostname === "gpt-tour-planner.vercel.app") {
      window.location.replace("https://www.tinycoders.io/");
    }
  }

  async function hitAPI() {
    try {
      if (!request.city || !request.days) return;
      setMessage("Building itinerary...");
      setLoading(true);
      setItinerary("");
      setPoints([]);

      setTimeout(() => {
        if (!loading) return;
        setMessage("Getting closer ...");
      }, 7000);

      setTimeout(() => {
        if (!loading) return;
        setMessage("Almost there ...");
      }, 15000);

      const {
        pointsOfInterestPrompt,
        itinerary,
        morningPrompt,
        afternoonPrompt,
        eveningPrompt,
      } = await getItinerary(request.days, request.city);

      const pointsOfInterest = await getPointsOfInterest(
        pointsOfInterestPrompt
      );
      setPoints(pointsOfInterest);

      console.log("potttt", pointsOfInterest, points);

      const extractedData = await getdata(
        morningPrompt,
        eveningPrompt,
        afternoonPrompt
      );
      console.log("heheh", extractedData);

      let updatedItinerary = itinerary;

      pointsOfInterest.forEach((point) => {
        const link = `[${point}](https://www.google.com/search?q=${encodeURIComponent(
          point + " " + request.city
        )})`;
        updatedItinerary = updatedItinerary.replace(point, link);
      });

      setItinerary(updatedItinerary);
      setSharedContent(updatedItinerary);

      // Backend API call
      const data = {
        days: request.days,
        city: request.city,
        itinerary: pointsOfInterest.join("\n"),
      };

      const response = await axios.post(`${BASE_URL}/api/saveItinerary`, data);
      console.log("Response from backend:", response.data);

      setLoading(false);
    } catch (err) {
      console.log("error: ", err);
      setMessage("");
    }
  }

  useEffect(() => {
    let days = itinerary.split("Day");
    if (days.length > 1) {
      days.shift();
    } else {
      days[0] = "1" + days[0];
    }
    setDaysArray(days);
  }, [itinerary]);

  // Fetch recent searches from the backend
  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/recentSearches`);
      setRecentSearches(response.data);
    } catch (error) {
      console.log("Error fetching recent searches:", error);
    }
  };

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header} className="hero-header">
          Tiny Travelers
        </h1>
        <div style={styles.formContainer} className="form-container">
          <input
            style={styles.input}
            placeholder="City"
            onChange={(e) =>
              setRequest((request) => ({ ...request, city: e.target.value }))
            }
          />
          <input
            style={styles.input}
            placeholder="Days"
            onChange={(e) =>
              setRequest((request) => ({ ...request, days: e.target.value }))
            }
          />
          <button className="button" style={styles.button} onClick={hitAPI}>
            Build Itinerary
          </button>
        </div>
        <div className="results-container" style={styles.resultsContainer}>
          {loading && <p>{message}</p>}
          {itinerary &&
            daysArray.map((day, index) => (
              <div style={styles.dayContainer} key={index}>
                <h2 style={styles.dayHeading}>{`Day ${index + 1}`}</h2>
                <div style={styles.activitiesContainer}>
                  {day
                    .trim()
                    .split(".")
                    .map((item, i) => (
                      <div key={i} style={styles.activity}>
                        {item.trim()}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div>
          <h2 style={styles.sectionHeading}>Recent Searches</h2>
          <div style={styles.recentSearchesContainer}>
            {recentSearches
              .filter((search) => search.itinerary) // Filter out searches without itinerary content
              .map((search, index) => (
                <div className="card" style={styles.card} key={index}>
                  <p className="city" style={styles.city}>
                    {search.city}
                  </p>
                  <p className="days" style={styles.days}>
                    <strong>{search.days} Days</strong>
                  </p>
                  <div className="itinerary" style={styles.itinerary}>
                    {search.itinerary.split("\n").map((item, i) => (
                      <div key={i} style={styles.itineraryItem}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          {sharedContent && (
            <div style={styles.shareOptions}>
              <h2 style={styles.sectionHeading}>Share Trip Details</h2>
              <div style={styles.shareButtons}>
                <EmailShareButton
                  subject={`${request.city} Trip Details`}
                  body={sharedContent}
                  separator="\n\n"
                >
                  <button className="button" style={styles.button}>
                    Share via Email
                  </button>
                </EmailShareButton>
                <WhatsappShareButton
                  title={`${request.city} Trip Details`}
                  url={sharedContent}
                >
                  <button className="button" style={styles.button}>
                    Share via WhatsApp
                  </button>
                </WhatsappShareButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const styles = {
  header: {
    textAlign: "center",
    marginTop: "60px",
    color: "#333",
    fontWeight: "900",
    fontFamily: "Poppins",
    fontSize: "40px",
  },
  input: {
    padding: "10px 14px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px auto",
    maxWidth: "60%",
  },
  // resultsContainer: {
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   margin: "40px auto",
  //   maxWidth: "800px",
  // },
  resultsContainer: {
    width: "40rem",
    margin: "auto",
  },
  dayContainer: {
    marginBottom: "40px",
  },
  dayHeading: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  activitiesContainer: {
    textAlign: "left",
  },
  activity: {
    marginBottom: "10px",
    fontSize: "16px",
    color: "#333",
  },
  sectionHeading: {
    textAlign: "center",
    marginTop: "40px",
    marginBottom: "20px",
    color: "#333",
    fontWeight: "bold",
    fontFamily: "Poppins",
    fontSize: "24px",
  },
  recentSearchesContainer: {
    display: "flex",
    overflowX: "auto",
    border: "1px solid #000000",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "1rem",
    width: "90%",
    margin: "auto",
  },

  card: {
    flex: "0 0 auto",
    width: "15rem",
    marginRight: "10px",
    padding: "10px",
    boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  //
  city: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    height: "2rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  days: {
    fontSize: "16px",
    marginBottom: "5px",
    height: "1.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "2rem",
    color: "#777",
  },

  itinerary: {
    fontSize: "14px",
    height: "10rem",
    overflowY: "auto",
  },
  itineraryItem: {
    marginBottom: "5px",
  },
  shareOptions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px auto",
    maxWidth: "800px",
  },
  shareButtons: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
};
