import { createBrowserRouter } from "react-router-dom";
import { VocabListPage } from "../features/vocab/pages/VocabListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <VocabListPage />,
  },
  {
    path: "/vocabs",
    element: <VocabListPage />,
  },
]);
