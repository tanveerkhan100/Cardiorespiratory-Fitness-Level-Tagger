import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("female");
  const [activity, setActivity] = useState("some");
  const [breath, setBreath] = useState("somewhatHard");
  const [stairs, setStairs] = useState("ok");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const inputBase =
    "w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const ageNum = Number(age);
    if (!ageNum || ageNum < 16) {
      setError("Please enter a valid age (16+).");
      return;
    }

    const score = calculateScore({
      age: ageNum,
      activity,
      breath,
      stairs,
    });

    const zone = classifyFitness(score, ageNum);
    const interpretation = interpretFitness(zone);
    const lifestyleTips = lifestyleAdvice(zone);

    setResult({
      zone,
      score,
      interpretation,
      lifestyleTips,
      answers: { age: ageNum, sex, activity, breath, stairs },
    });
  };

  const calculateScore = ({ age, activity, breath, stairs }) => {
    let score = 0;

    // Age (older age tends to lower CRF on average)
    if (age >= 70) score += 4;
    else if (age >= 60) score += 3;
    else if (age >= 50) score += 2;
    else if (age >= 40) score += 1;

    // Weekly physical activity (cardio + brisk walking etc.)
    if (activity === "guidelines") score -= 1; // meets general guidelines
    else if (activity === "high") score -= 2; // very active
    else if (activity === "low") score += 2; // mostly inactive

    // Breathlessness during a brisk walk / slow jog
    if (breath === "veryHard") score += 3;
    else if (breath === "somewhatHard") score += 1;
    else if (breath === "comfortable") score -= 1;

    // Climbing a flight of stairs
    if (stairs === "struggle") score += 3;
    else if (stairs === "ok") score += 1;
    else if (stairs === "easy") score -= 1;

    // Keep score within a reasonable range
    if (score < -2) score = -2;

    return score;
  };

  const classifyFitness = (score, age) => {
    // Higher score = more indicators of lower cardiorespiratory fitness.
    if (score <= 0) {
      return {
        level: "veryHigh",
        label: "Very High / Excellent CRF",
        description:
          "Your answers suggest strong everyday stamina and a generally high cardiorespiratory fitness level for your age.",
      };
    }
    if (score <= 4) {
      return {
        level: "high",
        label: "Good CRF",
        description:
          "You report a fairly active lifestyle with manageable breathlessness, suggesting a good level of fitness.",
      };
    }
    if (score <= 8) {
      return {
        level: "moderate",
        label: "Moderate CRF",
        description:
          "There are signs your current fitness is in a moderate range, with room to build more stamina over time.",
      };
    }
    return {
      level: "low",
      label: "Lower CRF Indication",
      description:
        "Your answers show several indicators of lower cardiorespiratory fitness. Building gradual activity could be especially helpful.",
    };
  };

  const interpretFitness = (zone) => {
    switch (zone.level) {
      case "veryHigh":
        return (
          "You seem to have strong day-to-day endurance, good recovery during walking, " +
          "and relatively few signs of breathlessness with basic exertion. Keeping this up can support heart, lung, and metabolic health."
        );
      case "high":
        return (
          "Your current habits and responses suggest generally good cardiorespiratory fitness. " +
          "You may still benefit from gently progressing your weekly activity or adding variety (intervals, hills, different sports) if safe for you."
        );
      case "moderate":
        return (
          "Your fitness may sit around the middle range: you can likely manage everyday tasks but may notice breathlessness " +
          "with faster walking, stairs, or hills. Consistent, gradual increases in movement can slowly nudge you toward a higher fitness level."
        );
      case "low":
        return (
          "Your answers indicate that even modest exertion (such as brisk walking or stairs) may feel quite demanding. " +
          "This does not diagnose any condition, but it suggests that talking to a healthcare professional about safe ways " +
          "to build up activity—and checking that there is no underlying heart or lung issue—could be useful."
        );
      default:
        return "";
    }
  };

  const lifestyleAdvice = (zone) => {
    const general = [
      "If you are unsure what intensity is safe, ask a healthcare professional before starting a new program.",
      "Use the “talk test”: during moderate activity you can talk in full sentences; during vigorous activity you can say only a few words at a time.",
      "Warm up gently and cool down after exercise, especially if you have been mostly inactive.",
      "Spread activity across the week instead of doing everything on one day.",
    ];

    switch (zone.level) {
      case "veryHigh":
        return [
          "Keep mixing in a variety of activities (walking, cycling, swimming, sports, etc.) to stay engaged.",
          "Add in some structured easier days so you do not overtrain or burn out.",
          "Consider occasional fitness checks (like a timed walk or step test) to track progress safely.",
          ...general,
        ];
      case "high":
        return [
          "Aim to meet or slightly exceed standard activity guidelines if safe: about 150–300 minutes per week of moderate activity, or 75–150 minutes vigorous, plus strength work.",
          "Try adding short intervals (slightly faster bursts followed by easier pace) once or twice a week to gently challenge your heart and lungs.",
          "Keep one or two rest or light-activity days weekly for recovery.",
          ...general,
        ];
      case "moderate":
        return [
          "If cleared for exercise, start with short bouts of walking (5–10 minutes) and slowly build up time and pace.",
          "Try to move on most days—frequency matters more than intensity at first.",
          "Use landmarks (e.g., one more flight of stairs, a slightly longer loop) as simple, safe progression goals.",
          ...general,
        ];
      case "low":
        return [
          "Discuss your current breathlessness and any chest pain, dizziness, or unusual fatigue with a clinician before making big changes.",
          "If you get medical clearance, start with very short, gentle walks or chair-based movements and increase by just a few minutes at a time.",
          "Consider supervised programs (cardiac rehab, pulmonary rehab, or physiotherapy) if they are recommended and available.",
          ...general,
        ];
      default:
        return general;
    }
  };

  const badgeClass = (level) => {
    switch (level) {
      case "veryHigh":
        return "bg-emerald-100 text-emerald-700";
      case "high":
        return "bg-blue-100 text-blue-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Cardiorespiratory Fitness Level Tagger
        </h2>
        <p className="text-gray-500 text-sm text-center mb-5">
          A simple, self-report tool that tags your likely cardiorespiratory
          fitness level based on age, activity, and everyday effort. Informational
          only, <span className="font-semibold">not</span> a medical test or
          diagnosis.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Age + Sex */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium block">Age (years)</label>
              <input
                className={inputBase}
                type="number"
                placeholder="e.g. 38"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium block">Sex</label>
              <select
                className={inputBase}
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Weekly activity */}
          <div className="space-y-1">
            <label className="text-sm font-medium block">
              Weekly movement / exercise
            </label>
            <select
              className={inputBase}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="low">
                I’m mostly inactive (short walks only, rare exercise)
              </option>
              <option value="some">
                I’m active 1–2 days per week (walks, light exercise)
              </option>
              <option value="guidelines">
                I’m active most days (roughly meeting standard guidelines)
              </option>
              <option value="high">
                I train or exercise intensely several days per week
              </option>
            </select>
          </div>

          {/* Breathlessness */}
          <div className="space-y-1">
            <label className="text-sm font-medium block">
              How does a 10–15 minute brisk walk feel?
            </label>
            <select
              className={inputBase}
              value={breath}
              onChange={(e) => setBreath(e.target.value)}
            >
              <option value="comfortable">
                Comfortable; I can chat easily
              </option>
              <option value="somewhatHard">
                A bit hard; I breathe faster but can still talk
              </option>
              <option value="veryHard">
                Very hard; I need to slow down or stop
              </option>
            </select>
          </div>

          {/* Stairs */}
          <div className="space-y-1">
            <label className="text-sm font-medium block">
              One flight of stairs (about 10–15 steps)
            </label>
            <select
              className={inputBase}
              value={stairs}
              onChange={(e) => setStairs(e.target.value)}
            >
              <option value="easy">
                I go up comfortably without stopping
              </option>
              <option value="ok">
                I can do it but feel somewhat winded
              </option>
              <option value="struggle">
                I need to stop, hold the rail, or avoid stairs
              </option>
            </select>
            <p className="text-[11px] text-gray-400">
              Answer based on your usual recent experience, not one unusually
              good or bad day.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition"
          >
            Tag My Fitness Level
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="mt-4 bg-red-100 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </p>
        )}

        {/* RESULT */}
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">
                Your CRF Level Tag
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass(
                  result.zone.level
                )}`}
              >
                {result.zone.label}
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-1">
              Screening score (higher = more signs of lower fitness):{" "}
              <span className="font-semibold">{result.score}</span>
            </p>

            <p className="text-sm text-gray-700 mb-2">
              {result.zone.description}
            </p>

            <p className="text-sm text-gray-700 mb-3">
              {result.interpretation}
            </p>

            {result.lifestyleTips?.length > 0 && (
              <>
                <h4 className="text-sm font-semibold mb-1">
                  Heart- and lung-friendly ideas:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.lifestyleTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </>
            )}

            <hr className="my-3" />

            <p className="text-[11px] text-gray-400">
              This tool cannot diagnose any heart, lung, or metabolic condition
              and does not replace professional evaluation. If you experience
              chest pain, severe breathlessness, dizziness, or fainting with
              activity, seek medical advice promptly and before pushing your
              exercise intensity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
