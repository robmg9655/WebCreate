import React from 'react';

export default function LanguageSelector() {
  return (
    <div>
      <label htmlFor="locale" className="sr-only">
        Language
      </label>
      <select id="locale" defaultValue="en" className="border rounded p-1">
        <option value="en">EN</option>
        <option value="jp">JP</option>
      </select>
    </div>
  );
}
