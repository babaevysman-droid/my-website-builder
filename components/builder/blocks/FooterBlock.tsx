export default function FooterBlock({ text }: { text: string }) {
  return (
    <footer className="border-t px-8 py-8 text-center text-sm text-neutral-500">
      {text}
    </footer>
  );
}