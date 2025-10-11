import { createBrowserRouter } from "react-router-dom";
import { VocabListPage } from "../features/vocab/pages/VocabListPage";
import { DeckListPage } from "../features/decks/pages/DeckListPage";
import { DeckDetailPage } from "../features/decks/pages/DeckDetailPage";
import { Layout } from "../components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DeckListPage />,
      },
      {
        path: "decks",
        element: <DeckListPage />,
      },
      {
        path: "decks/:slug",
        element: <DeckDetailPage />,
      },
      {
        path: "vocabs",
        element: <VocabListPage />,
      },
    ],
  },
]);
