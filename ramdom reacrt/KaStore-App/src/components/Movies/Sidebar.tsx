import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MovieGenreType } from "../Types/Types";
import { LanguageType } from "../Types/Types";
interface MovieGenreProps {
  movieGenre: MovieGenreType[];
  handleGenreChange(genre: number): void;
  selectedGenre: number[];
  handleFilterClick(): void;
  handleReleaseDateChange: (from: string, to: string) => void;
  selectedSort: string;
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  language: LanguageType[];
  selectedLanguage:string |null;
  handleLanguageChange :(event:any) =>void;
}

const Sidebar: FC<MovieGenreProps> = ({
  movieGenre,
  handleGenreChange,
  selectedGenre,
  handleFilterClick,
  handleReleaseDateChange,
  selectedSort,
  handleRadioChange,
  language,
  selectedLanguage, 
  handleLanguageChange, 
}) => {
  const [releaseDateFrom, setReleaseDateFrom] = useState<string>("");
  const [releaseDateTo, setReleaseDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);


  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReleaseDateFrom(event.target.value);
    handleReleaseDateChange(event.target.value, releaseDateTo);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReleaseDateTo(event.target.value);
    handleReleaseDateChange(releaseDateFrom, event.target.value);
  };


  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    const selectedLang = language.find(lang => lang.english_name === value);
    if (selectedLang) {
      handleLanguageChange(selectedLang.iso_639_1);
    }
    setIsDropdownOpen(false);
  };
  


  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleScroll = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };
  const filteredLanguages = language.filter((option) =>
  option.english_name.toLowerCase().includes(searchQuery.toLowerCase())
);

  useEffect(() => {
    if (isDropdownOpen) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDropdownOpen]);

  return (
    <Box display={"flex"} gap={10}>
      <Box gap={20} sx={{ width: "100%" }}>
        <Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold" variant="h5">
                Sort
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl component="fieldset">
                <RadioGroup value={selectedSort} onChange={handleRadioChange}>
                  <FormControlLabel
                    value="popular"
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontSize: "1.5rem", color: "black" }}>
                        Popular
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="topRated"
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontSize: "1.5rem", color: "black" }}>
                        Most Rated
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ marginTop: "16px" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={"bold"} variant="h5">
                Filters
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h5" fontWeight={"bold"}>
                Release Dates
              </Typography>
              <Typography variant="body1">From:</Typography>
              <TextField
                type="date"
                variant="outlined"
                fullWidth
                margin="dense"
                value={releaseDateFrom}
                onChange={handleFromDateChange}
              />
              <Typography variant="body1">To:</Typography>
              <TextField
                type="date"
                variant="outlined"
                fullWidth
                margin="dense"
                value={releaseDateTo}
                onChange={handleToDateChange}
              />

              <Box sx={{ marginTop: "16px" }}>
                <Typography variant="h5" fontWeight="bold">
                  Genres
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    marginTop: 2,
                  }}
                >
                  {movieGenre.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      onClick={() => handleGenreChange(genre.id)}
                      sx={{
                        cursor: "pointer",
                        fontSize: "1.4rem",
                        backgroundColor: selectedGenre.includes(genre.id)
                          ? "primary.main"
                          : "default",
                        color: selectedGenre.includes(genre.id)
                          ? "white"
                          : "black",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <div className="custom-select-container">
  <div className="custom-select" onClick={handleToggleDropdown}>
    <span>{selectedValue || "Select an language"}</span>
    <div className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}>
      ▼
    </div>
  </div>

  {isDropdownOpen && (
    <ul className="custom-select-options">
      <input
        type="text"
        placeholder="Search languages..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {filteredLanguages.map((option) => (
        <li
          key={option.iso_639_1}
          onClick={() => handleOptionClick(option.english_name)}
          className="custom-select-option"
        >
          {option.english_name}
        </li>
      ))}
    </ul>
  )}
</div>

            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterClick}
            sx={{
              marginTop: "20px",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              width: "100%",
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
