import { useState, useRef, useEffect } from "react";
import { RxDotFilled } from "react-icons/rx";
import { MdError } from "react-icons/md";
import { CgPlayListAdd } from "react-icons/cg";
import { IoChevronDown } from "react-icons/io5";
import { TEAMS } from "./data";

interface Entry {
  id: number;
  name: string;
  teamKey: string | null;
  color: string;
  ms: number;
}

const MAX_PARTICIPANTS = 22;

const driverTeamLookup: Record<string, string> = {};
TEAMS.forEach((team) => {
  team.drivers.forEach((d) => {
    driverTeamLookup[d.name.toLowerCase()] = team.key;
  });
});

export default function LeaderLiveBoard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [lastUpdated, setLastUpdated] = useState("--:--:--");
  const [highlightedEntryId, setHighlightedEntryId] = useState<number | null>(
    null,
  );
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [driverName, setDriverName] = useState("");
  const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);
  const [mm, setMm] = useState("");
  const [ss, setSs] = useState("");
  const [mmm, setMmm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const idSeedRef = useRef(1);
  const ssRef = useRef<HTMLInputElement>(null);
  const mmmRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const driverWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        driverWrapRef.current &&
        !driverWrapRef.current.contains(e.target as Node)
      ) {
        setDriverDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelectTeam = (key: string) => {
    setSelectedTeam((prev) => {
      if (prev !== key) {
        setDriverName("");
      }
      return key;
    });
  };

  const driverOptions = selectedTeam
    ? (TEAMS.find((t) => t.key === selectedTeam)?.drivers.map((d) => ({
        ...d,
        teamKey: selectedTeam,
      })) ?? [])
    : TEAMS.flatMap((t) => t.drivers.map((d) => ({ ...d, teamKey: t.key })));

  const handlePickDriver = (name: string, teamKey: string) => {
    setDriverName(name);
    setSelectedTeam(teamKey);
    setDriverDropdownOpen(false);
  };

  const handleLapChange = (
    field: "mm" | "ss" | "mmm",
    raw: string,
    max: number,
  ) => {
    const digits = raw.replace(/\D/g, "").slice(0, max);
    if (field === "mm") setMm(digits);
    if (field === "ss") setSs(digits);
    if (field === "mmm") setMmm(digits);

    if (digits.length >= max) {
      if (field === "mm") ssRef.current?.focus();
      if (field === "ss") mmmRef.current?.focus();
    }
  };

  const handleLapKeyDown = (
    field: "mm" | "ss" | "mmm",
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "ArrowRight") {
      if (field === "mm") ssRef.current?.focus();
      if (field === "ss") mmmRef.current?.focus();
    } else if (e.key === "ArrowLeft") {
      if (field === "ss") mmRef.current?.focus();
      if (field === "mmm") ssRef.current?.focus();
    }
  };

  const handleAddEntry = () => {
    const name = driverName.trim();
    const mmN = parseInt(mm || "0", 10);
    const ssN = parseInt(ss || "0", 10);
    const mmmN = parseInt(mmm || "0", 10);

    if (!name) {
      setFormError("Please select or enter a driver name.");
      return;
    }
    if (mmN === 0 && ssN === 0 && mmmN === 0) {
      setFormError("Please enter a valid lap time.");
      return;
    }

    const existing = entries.find(
      (e) => e.name.toLowerCase() === name.toLowerCase(),
    );

    if (!existing && entries.length >= MAX_PARTICIPANTS) {
      setFormError(`Leaderboard is full (max ${MAX_PARTICIPANTS} participants).`);
      return;
    }

    setFormError(null);

    const ms = mmN * 60000 + ssN * 1000 + mmmN;
    const teamKey =
      selectedTeam ?? driverTeamLookup[name.toLowerCase()] ?? null;
    const team = TEAMS.find((t) => t.key === teamKey);
    const color = team ? team.color : "#B2B2B2";

    if (existing) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === existing.id ? { ...e, teamKey, color, ms } : e,
        ),
      );
      setHighlightedEntryId(existing.id);
    } else {
      const newEntry: Entry = {
        id: idSeedRef.current++,
        name,
        teamKey,
        color,
        ms,
      };
      setEntries((prev) => [...prev, newEntry]);
      setHighlightedEntryId(newEntry.id);
    }

    setLastUpdated(new Date().toTimeString().slice(0, 8));
    setTimeout(() => setHighlightedEntryId(null), 1000);

    setDriverName("");
    setMm("");
    setSs("");
    setMmm("");
    setSelectedTeam(null);
  };

  const blendColor = (
    foreground: string,
    background: string,
    alpha: number,
  ) => {
    const fg = foreground.replace("#", "");
    const bg = background.replace("#", "");

    const fr = parseInt(fg.substring(0, 2), 16);
    const fgG = parseInt(fg.substring(2, 4), 16);
    const fb = parseInt(fg.substring(4, 6), 16);

    const br = parseInt(bg.substring(0, 2), 16);
    const bgG = parseInt(bg.substring(2, 4), 16);
    const bb = parseInt(bg.substring(4, 6), 16);

    const r = Math.round(fr * alpha + br * (1 - alpha));
    const g = Math.round(fgG * alpha + bgG * (1 - alpha));
    const b = Math.round(fb * alpha + bb * (1 - alpha));

    return `rgb(${r}, ${g}, ${b})`;
  };

  const msToStr = (ms: number): string => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const mmmPart = ms % 1000;
    return `${m}:${String(s).padStart(2, "0")}.${String(mmmPart).padStart(3, "0")}`;
  };

  const sortedEntries = [...entries].sort((a, b) => a.ms - b.ms);
  const visibleEntries = sortedEntries;
  const isFull = entries.length >= MAX_PARTICIPANTS;

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        @keyframes rowJustAdded {
          0% { transform: scale(1); }
          30% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        .row-just-added {
          animation: rowJustAdded 0.8s ease-in-out;
          transform-origin: center;
          position: relative;
          z-index: 1;
        }
      `}</style>
      {/* header */}
      <div className="flex items-center h-16 bg-[#1D1D27] px-4">
        <img
          src="/src/assets/images/f1logo.png"
          alt="Logo"
          className="h-full w-auto mr-4"
        />
        <h1 className="text-md font-alphacorsa text-white">FORMULA 1</h1>
        <h1 className="text-md font-magistral font-bold text-[#FF1E00] ml-3">
          LIVE
        </h1>
        <h1 className="text-md font-magistral font-bold text-white ml-2">
          LEADERBOARD
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center bg-[#FF1E00]/20 pr-3 pl-1.5 py-1 rounded-sm animate-pulse">
            <RxDotFilled className="text-[#FF1E00] mr-1" />
            <span className="font-magistral font-bold text-[#FF1E00] text-sm">
              LIVE
            </span>
          </div>
          <h1 className="font-magistral font-bold text-white text-sm">
            Last updated: <span className="text-[#B2B2B2]">{lastUpdated}</span>
          </h1>
        </div>
      </div>

      {/* left box */}
      <div className="flex flex-1 gap-4 px-4 pt-7 pb-4 items-start">
        <div className="flex-2 bg-[#17171F] border border-[#303039] rounded-xl px-6 py-4 flex flex-col">
          <div className="flex items-baselin">
            <h1 className="text-xl font-alphacorsa text-white">
              CURRENT STANDINGS
            </h1>
            <div className="ml-auto gap-3 flex items-center">
              <span className="font-magistral font-bold text-sm -mr-1">
                {entries.length}
              </span>
              <span className="font-magistral font-bold text-sm -mr-1">/</span>
              <span className="font-magistral font-bold text-sm">
                {MAX_PARTICIPANTS}
              </span>
              <span className="font-magistral font-bold text-[#B2B2B2] text-sm">
                PARTICIPANTS
              </span>
            </div>
          </div>

          {/* table */}
          <div className="relative mt-5 mb-2 border border-[#303039] rounded-xl overflow-visible flex-1 flex flex-col">
            <div className="grid grid-cols-[70px_1.6fr_1.1fr_1fr_0.7fr] items-center px-6 py-3.5 border-b border-[#303039] bg-[#303039] rounded-t-xl">
              <span className="font-magistral font-bold text-white text-sm">
                POS.
              </span>
              <span className="font-magistral font-bold text-white text-sm">
                DRIVER
              </span>
              <span className="font-magistral font-bold text-white text-sm">
                TEAM
              </span>
              <span className="font-magistral font-bold text-white text-sm">
                LAP TIME
              </span>
              <span className="font-magistral font-bold text-white text-sm text-right">
                GAP
              </span>
            </div>

            {visibleEntries.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-4.5">
                <span className="font-magistral text-[#666670] text-sm">
                  No entries yet.
                </span>
              </div>
            )}

            {visibleEntries.map((entry, i) => {
              const pos = i + 1;
              const isP1 = pos === 1;
              const isLast = i === visibleEntries.length - 1;
              const needsCornerCarve = isLast && isP1;
              const team = TEAMS.find((t) => t.key === entry.teamKey);
              const driverPhoto = team?.drivers.find(
                (d) => d.name === entry.name,
              )?.photo;
              const gap =
                pos === 1
                  ? "-"
                  : `+ ${((entry.ms - sortedEntries[0].ms) / 1000).toFixed(3)}`;
              const cornerCarveStyle = needsCornerCarve
                ? { clipPath: "inset(0 round 0 0 0 12px)" }
                : {};

              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-[70px_1.6fr_1.1fr_1fr_0.7fr] items-center px-6 py-3.5 border-b border-[#22222b] border-l-4 ${
                    isLast && !isP1 ? "rounded-bl-xl" : ""
                  } ${isLast ? "rounded-br-xl" : ""} ${
                    entry.id === highlightedEntryId ? "row-just-added" : ""
                  }`}
                  style={{
                    borderLeftColor: isP1 ? entry.color : "transparent",
                    background: isP1
                      ? blendColor(entry.color, "#17171F", 0.08)
                      : "#17171F",
                    ...cornerCarveStyle,
                  }}
                >
                  <span
                    className="font-magistral font-bold text-lg"
                    style={{ color: isP1 ? entry.color : "#B2B2B2" }}
                  >
                    {pos}
                  </span>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-6 h-6 rounded-full flex-none overflow-hidden"
                      style={{ background: entry.color }}
                    >
                      {driverPhoto && (
                        <img
                          src={driverPhoto}
                          alt={entry.name}
                          className="w-full h-full object-cover object-top"
                        />
                      )}
                    </div>
                    <span className="font-magistral text-sm">
                      <span className="text-white">
                        {entry.name.split(" ")[0]}{" "}
                      </span>
                      <span className="font-bold text-white ml-2">
                        {entry.name.split(" ").slice(1).join(" ")}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-5 flex items-center justify-center flex-none">
                      {team?.logo && (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      )}
                    </div>
                    <span className="font-magistral text-white text-sm">
                      {team ? team.name : "Independent"}
                    </span>
                  </div>

                  <span
                    className="font-magistral font-bold text-sm w-fit px-2.5 py-1 rounded"
                    style={
                      isP1
                        ? {
                            color: "#3ADB76",
                            background: "rgba(58,219,118,0.12)",
                          }
                        : { color: "#fff" }
                    }
                  >
                    {msToStr(entry.ms)}
                  </span>

                  <span className="font-magistral text-white text-sm text-right">
                    {gap}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* right box */}
        <div className="flex-1 bg-[#17171F] border border-[#303039] rounded-xl px-6 pt-4 pb-6 flex flex-col gap-7">
          <div className="flex items-center gap-3.5">
            <img
              src="/src/assets/icons/boxicons_helmet-filled.svg"
              alt="helmet"
              className="w-5.5 h-5.5"
            />
            <h1 className="text-xl font-alphacorsa text-white">
              ADD NEW ENTRY
            </h1>
          </div>

          {/* Team */}
          <span className="font-magistral font-bold text-[#B2B2B2] text-sm">
            Team
          </span>
          <div className="grid grid-cols-4 gap-3.5 -mt-4">
            {TEAMS.map((team) => {
              const isSelected = selectedTeam === team.key;
              return (
                <div
                  key={team.key}
                  onClick={() => handleSelectTeam(team.key)}
                  className="h-16 py-2 bg-[#D9D9D9]/3 border border-[#303039] rounded hover:border-[#4E4E5B] flex flex-col items-center cursor-pointer"
                  style={
                    isSelected
                      ? {
                          borderColor: "#DD0000",
                          background:
                            "linear-gradient(to bottom, #17171F, rgba(221,0,0,0.3))",
                        }
                      : undefined
                  }
                >
                  <div className="flex-1 flex items-start justify-center">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                  <span className="font-magistral text-white text-xs leading-none text-center">
                    {team.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* driver name — dropdown */}
          <span className="font-magistral font-bold text-[#B2B2B2] text-sm">
            Driver name
          </span>
          <div className="relative -mt-4" ref={driverWrapRef}>
            <div
              onClick={() => setDriverDropdownOpen((v) => !v)}
              className="h-10 border border-[#303039] rounded bg-[#D9D9D9]/3 flex items-center justify-between px-3 cursor-pointer hover:border-[#4E4E5B]"
            >
              <span
                className={`font-magistral text-sm ${
                  driverName ? "text-white" : "text-[#666670]"
                }`}
              >
                {driverName || "Enter driver name"}
              </span>
              <IoChevronDown
                className={`text-[#666670] text-sm transition-transform ${
                  driverDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {driverDropdownOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 bg-[#17171F] border border-[#303039] rounded max-h-56 overflow-y-auto">
                {driverOptions.map((d) => (
                  <div
                    key={d.name}
                    onClick={() => handlePickDriver(d.name, d.teamKey)}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#D9D9D9]/5 cursor-pointer"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex-none overflow-hidden"
                      style={{
                        background:
                          TEAMS.find((t) => t.key === d.teamKey)?.color ??
                          "#B2B2B2",
                      }}
                    >
                      <img
                        src={d.photo}
                        alt={d.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="font-magistral text-white text-sm">
                      {d.name}
                    </span>
                    {!selectedTeam && (
                      <span className="ml-auto font-magistral text-[#666670] text-xs">
                        {TEAMS.find((t) => t.key === d.teamKey)?.name}
                      </span>
                    )}
                  </div>
                ))}
                {driverOptions.length === 0 && (
                  <div className="px-3 py-2 font-magistral text-[#666670] text-sm">
                    No drivers
                  </div>
                )}
              </div>
            )}
          </div>

          {/* lap time */}
          <span className="font-magistral font-bold text-[#B2B2B2] text-sm">
            Lap time
          </span>
          <div className="flex gap-2.5 items-center">
            <input
              ref={mmRef}
              value={mm}
              onChange={(e) => handleLapChange("mm", e.target.value, 2)}
              onKeyDown={(e) => handleLapKeyDown("mm", e)}
              inputMode="numeric"
              placeholder="mm"
              className="h-10 w-12.5 border border-[#303039] rounded -mt-4 bg-[#D9D9D9]/3 flex items-center px-3 justify-center text-center font-magistral text-white placeholder:text-[#666670] text-sm focus:outline-none focus:border-[#4E4E5B]"
            />
            <span className="font-magistral font-bold text-[#B2B2B2] text-sm -mt-4">
              :
            </span>
            <input
              ref={ssRef}
              value={ss}
              onChange={(e) => handleLapChange("ss", e.target.value, 2)}
              onKeyDown={(e) => handleLapKeyDown("ss", e)}
              inputMode="numeric"
              placeholder="ss"
              className="h-10 w-12.5 border border-[#303039] rounded -mt-4 bg-[#D9D9D9]/3 flex items-center px-3 justify-center text-center font-magistral text-white placeholder:text-[#666670] text-sm focus:outline-none focus:border-[#4E4E5B]"
            />
            <span className="font-magistral font-bold text-[#B2B2B2] text-sm -mt-4">
              .
            </span>
            <input
              ref={mmmRef}
              value={mmm}
              onChange={(e) => handleLapChange("mmm", e.target.value, 3)}
              onKeyDown={(e) => handleLapKeyDown("mmm", e)}
              inputMode="numeric"
              placeholder="mmm"
              className="h-10 w-14.5 border border-[#303039] rounded -mt-4 bg-[#D9D9D9]/3 flex items-center px-3 justify-center text-center font-magistral text-white placeholder:text-[#666670] text-sm focus:outline-none focus:border-[#4E4E5B]"
            />
          </div>

          {formError && (
            <div className="flex items-center gap-2 mt-2">
              <MdError className="text-[#FF4D4D] text-sm" />
              <span className="font-magistral text-[#FF4D4D] text-xs">
                {formError}
              </span>
            </div>
          )}

          {!formError && (
            <div className="flex items-center gap-2 mt-2">
              <MdError className="text-[#B2B2B2] text-sm" />
              <span className="font-magistral text-[#B2B2B2] text-xs">
                The new entry will be added at the correct position automatically.
              </span>
            </div>
          )}

          <button
            onClick={handleAddEntry}
            disabled={isFull}
            className={`font-magistral font-bold text-sm py-2 px-4 rounded-full flex items-center justify-center gap-2.5 -mt-2 ${
              isFull
                ? "bg-[#303039] text-[#666670] cursor-not-allowed"
                : "bg-[#F70000] hover:bg-[#DD0000] text-white"
            }`}
          >
            <CgPlayListAdd className="size-5" />
            {isFull ? "LEADERBOARD FULL" : "ADD TO LEADERBOARD"}
          </button>
        </div>
      </div>
    </div>
  );
}