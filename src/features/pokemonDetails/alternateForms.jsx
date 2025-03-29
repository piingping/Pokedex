import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AlternateForms({ varieties }) {
  const [current, setCurrent] = useState(0);

  const getIsSlideshow = () =>
    window.innerWidth <= 840 && window.innerWidth > 320;

  const [isSlideshow, setIsSlideshow] = useState(getIsSlideshow());

  useEffect(() => {
    const handleResize = () => setIsSlideshow(getIsSlideshow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (varieties.length <= 1) {
    return (
      <div className="alternative-container">
        <h2 className="alt-title">Alternate Forms</h2>
        <p
          style={{ color: "#FDFAF6", fontStyle: "italic", marginTop: "0.5rem" }}
        >
          No alternate forms
        </p>
      </div>
    );
  }

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? varieties.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === varieties.length - 1 ? 0 : prev + 1));

  if (isSlideshow) {
    const currentForm = varieties[current];

    return (
      <div className="alternative-container">
        <h2 className="alt-title">Alternate Forms</h2>

        <div className="alt-slider">
          <button className="alt-arrow" onClick={prev}>
            &lt;
          </button>

          <Link
            to={`/pokemon/${currentForm.name}`}
            className="alternative-card"
          >
            <img
              src={
                currentForm.sprites?.other?.["official-artwork"]
                  ?.front_default ?? currentForm.sprites?.front_default
              }
              alt={currentForm.name}
              style={{ width: 100, marginBottom: 8 }}
            />
            <div className="text-sm mt-2">
              <strong>#{currentForm.id.toString().padStart(4, "0")}</strong>
              <br />
              {currentForm.name.replace(/-/g, " ")}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
              {currentForm.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`type-badge type-${t.type.name}`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </Link>

          <button className="alt-arrow" onClick={next}>
            &gt;
          </button>
        </div>

        <div className="alt-dots">
          {varieties.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="alternative-container">
      <h2 className="alt-title">Alternate Forms</h2>
      <div className="alternative-card-list">
        {varieties.map((v) => (
          <Link
            key={v.name}
            to={`/pokemon/${v.name}`}
            className="alternative-card"
          >
            <img
              src={
                v.sprites?.other?.["official-artwork"]?.front_default ??
                v.sprites?.front_default
              }
              alt={v.name}
              style={{ width: 100, marginBottom: 8 }}
            />
            <div className="text-sm mt-2">
              <strong>#{v.id.toString().padStart(4, "0")}</strong>
              <br />
              {v.name.replace(/-/g, " ")}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
              {v.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`type-badge type-${t.type.name}`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
