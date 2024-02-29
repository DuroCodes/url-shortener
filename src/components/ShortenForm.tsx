import { type FormEvent, useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function ShortenForm() {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    await fetch("/api/shorten", {
      method: "POST",
      body: formData,
    });

    window.location.reload();
  }

  return (
    <form className="flex items-center gap-2 p-2" onSubmit={submit}>
      <Label className="sr-only" htmlFor="long-url">
        Enter your Long URL
      </Label>
      <Input
        className="flex-1 appearance-none"
        id="long-url"
        placeholder="Enter your Long URL"
        type="url"
        name="long-url"
        required
      />
      <Label className="sr-only" htmlFor="slug">
        Enter your custom alias
      </Label>
      <Input
        className="flex-1 appearance-none"
        id="slug"
        placeholder="Custom Alias"
        type="text"
        name="slug"
        required
      />
      <Button type="submit">Shorten</Button>
    </form>
  );
}
