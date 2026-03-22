import React from 'react';

export default function TagPill({ tag }) {
  return (
    <span className={`tag tag-${tag}`}>#{tag}</span>
  );
}
