import React from 'react';

export default function Contact(): JSX.Element {
  return (
    <section aria-label="contact" className="py-8">
      <form className="grid gap-2 max-w-md">
        <label>
          <span className="sr-only">Name</span>
          <input placeholder="Name" className="w-full border rounded p-2" />
        </label>
        <label>
          <span className="sr-only">Email</span>
          <input placeholder="Email" className="w-full border rounded p-2" />
        </label>
        <label>
          <span className="sr-only">Message</span>
          <textarea placeholder="Message" className="w-full border rounded p-2" />
        </label>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-teal-600 text-white rounded">Send</button>
        </div>
      </form>
      <div className="mt-4 text-sm">
        <a href="#" aria-label="LINE">
          LINE
        </a>{' '}
        ·{' '}
        <a href="#" aria-label="Instagram">
          Instagram
        </a>
      </div>
    </section>
  );
}
