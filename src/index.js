import React from "react";
import { createRoot } from "react-dom/client";

import Homepage from "./pages/Homepage";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Homepage />);
