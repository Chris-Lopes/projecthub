// This configuration ensures that the chat route is dynamically rendered
// and allows for dynamic route parameters
export const dynamic = "force-dynamic";
export const dynamicParams = true;

// Revalidate the page every 0 seconds (disabled) since we're using client-side polling
export const revalidate = 0;
