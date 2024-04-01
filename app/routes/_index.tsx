import { redirect } from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  // You can add any condition here for the redirection
  return redirect('/app');
};

export default function MyLoader() {
  // This component will never be rendered
  return null;
}
