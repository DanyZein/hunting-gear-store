import type { ReactNode } from "react";

import type { ArtKey } from "./types";

/**
 * Placeholder product illustrations.
 *
 * These exist so the catalog reads as a finished design with no photography.
 * When real photos land in Vercel Blob, set `image` on the product in
 * `content/products.json` and `ProductArt` renders the photo instead — the
 * drawings stay as the fallback for anything still unphotographed.
 *
 * Every drawing is authored on a 240x240 grid against the same 3px stroke, so
 * they stay visually consistent as the catalog grows.
 */

const jacket = (
  <>
    <path d="M97 63 C97 38 143 38 143 63" />
    <path d="M92 64 C88 64 85 67 85 72 L80 202 C80 206 83 209 87 209 L153 209 C157 209 160 206 160 202 L155 72 C155 67 152 64 148 64 Z" />
    <path d="M85 72 L60 92 L48 148 C47 154 51 158 57 158 L70 158 C75 158 78 154 79 149 L88 110" />
    <path d="M155 72 L180 92 L192 148 C193 154 189 158 183 158 L170 158 C165 158 162 154 161 149 L152 110" />
    <path d="M92 64 C100 74 140 74 148 64" />
    <path d="M120 76 L120 209" />
    <path d="M120 76 L125 86" />
    <path d="M92 150 L108 150" />
    <path d="M132 150 L148 150" />
  </>
);

const bib = (
  <>
    <path d="M84 60 L88 36 C88 31 92 28 97 28 L104 28" />
    <path d="M156 60 L152 36 C152 31 148 28 143 28 L136 28" />
    <path d="M76 58 L164 58 L168 122 L166 208 L130 208 L120 148 L110 208 L74 208 L72 122 Z" />
    <path d="M88 46 L100 46" />
    <path d="M140 46 L152 46" />
    <path d="M100 78 L140 78 L140 102 L100 102 Z" />
    <path d="M76 166 L106 166" />
    <path d="M134 166 L164 166" />
  </>
);

const vestBlaze = (
  <>
    <path d="M94 64 C86 70 84 82 86 94" />
    <path d="M146 64 C154 70 156 82 154 94" />
    <path d="M94 64 C90 64 87 67 87 72 L84 202 C84 206 87 209 91 209 L149 209 C153 209 156 206 156 202 L153 72 C153 67 150 64 146 64 Z" />
    <path d="M100 64 C104 74 136 74 140 64" />
    <path d="M120 76 L120 209" />
    <path d="M84 118 L156 118" />
    <path d="M88 154 L106 154" />
    <path d="M134 154 L152 154" />
  </>
);

const fleece = (
  <>
    <path d="M92 66 C88 66 85 69 85 74 L81 202 C81 206 84 209 88 209 L152 209 C156 209 159 206 159 202 L155 74 C155 69 152 66 148 66 Z" />
    <path d="M85 74 L62 94 L52 146 C51 152 55 155 60 155 L72 155 C77 155 80 152 81 147 L89 112" />
    <path d="M155 74 L178 94 L188 146 C189 152 185 155 180 155 L168 155 C163 155 160 152 159 147 L151 112" />
    <path d="M98 66 C102 78 138 78 142 66" />
    <path d="M120 74 L120 209" />
    <path d="M96 128 L114 128" />
    <path d="M84 192 C102 197 138 197 156 192" />
  </>
);

const vestDown = (
  <>
    <path d="M98 62 C98 54 142 54 142 62" />
    <path d="M98 62 C90 68 88 80 90 92" />
    <path d="M142 62 C150 68 152 80 150 92" />
    <path d="M98 62 C94 62 91 65 91 70 L87 202 C87 206 90 209 94 209 L146 209 C150 209 153 206 153 202 L149 70 C149 65 146 62 142 62 Z" />
    <path d="M120 74 L120 209" />
    <path d="M87 112 C104 118 136 118 153 112" />
    <path d="M87 140 C104 146 136 146 153 140" />
    <path d="M87 168 C104 174 136 174 153 168" />
  </>
);

const crew = (
  <>
    <path d="M96 68 C92 68 89 71 89 76 L86 200 C86 204 89 207 93 207 L147 207 C151 207 154 204 154 200 L151 76 C151 71 148 68 144 68 Z" />
    <path d="M89 76 L68 98 L60 138 C59 144 63 147 68 147 L78 147 C82 147 85 144 86 140 L92 112" />
    <path d="M151 76 L172 98 L180 138 C181 144 177 147 172 147 L162 147 C158 147 155 144 154 140 L148 112" />
    <path d="M106 68 C110 78 130 78 134 68" />
    <path d="M102 122 L114 122" />
  </>
);

const zipBase = (
  <>
    <path d="M104 66 L102 54 C102 50 106 48 110 48 L130 48 C134 48 138 50 138 54 L136 66" />
    <path d="M94 66 C90 66 87 69 87 74 L84 200 C84 204 87 207 91 207 L149 207 C153 207 156 204 156 200 L153 74 C153 69 150 66 146 66 Z" />
    <path d="M87 74 L66 96 L58 136 C57 142 61 145 66 145 L76 145 C80 145 83 142 84 138 L90 110" />
    <path d="M153 74 L174 96 L182 136 C183 142 179 145 174 145 L164 145 C160 145 157 142 156 138 L150 110" />
    <path d="M120 66 L120 132" />
    <path d="M120 66 L125 78" />
    <path d="M100 156 L114 156" />
  </>
);

const boot = (
  <>
    <path d="M58 86 C52 86 48 91 48 98 L46 168 L44 184 L196 184 C204 184 208 178 205 171 L196 150 C192 142 184 138 174 138 L118 132 C110 130 106 122 106 112 L104 94 C104 89 100 86 96 86 Z" />
    <path d="M57 96 C70 100 88 100 101 96" />
    <path d="M86 108 L108 112" />
    <path d="M85 120 L107 124" />
    <path d="M88 108 L88 112" />
    <path d="M87 120 L87 124" />
    <path d="M170 184 C177 175 180 166 177 156" />
    <path d="M70 188 L70 196" />
    <path d="M100 188 L100 196" />
    <path d="M130 188 L130 196" />
    <path d="M160 188 L160 196" />
  </>
);

const rubberBoot = (
  <>
    <path d="M56 54 C52 54 49 57 49 62 L46 168 L44 184 L196 184 C204 184 208 178 205 171 L196 150 C192 142 184 138 174 138 L122 132 C114 130 110 122 110 112 L108 62 C108 57 105 54 101 54 Z" />
    <path d="M50 70 C70 76 90 76 109 70" />
    <path d="M172 184 C180 174 183 164 180 152" />
    <path d="M49 176 L70 176" />
    <path d="M76 188 L76 196" />
    <path d="M106 188 L106 196" />
    <path d="M136 188 L136 196" />
  </>
);

const pack = (
  <>
    <path d="M104 86 C104 74 136 74 136 86" />
    <path d="M74 84 L166 84 C172 84 176 88 176 94 L182 200 C182 206 178 210 172 210 L68 210 C62 210 58 206 58 200 L64 94 C64 88 68 84 74 84 Z" />
    <path d="M58 126 L182 126" />
    <path d="M112 126 L128 126 L128 142 L112 142 Z" />
    <path d="M80 132 C70 160 70 188 76 210" />
    <path d="M160 132 C170 160 170 188 164 210" />
    <path d="M58 162 L78 162" />
    <path d="M162 162 L182 162" />
  </>
);

const headlamp = (
  <>
    <path d="M46 140 C46 68 194 68 194 140" />
    <path d="M86 104 L154 104 C160 104 164 108 164 114 L164 134 C164 140 160 144 154 144 L86 144 C80 144 76 140 76 134 L76 114 C76 108 80 104 86 104 Z" />
    <circle cx="120" cy="124" r="17" />
    <circle cx="120" cy="124" r="7" />
    <path d="M142 108 L152 97" />
    <path d="M147 124 L161 124" />
    <path d="M142 140 L152 151" />
    <path d="M78 133 L78 147" />
    <path d="M162 133 L162 147" />
  </>
);

const spotlight = (
  <>
    <path d="M46 106 L118 106 L118 150 L46 150 C40 150 36 146 36 140 L36 116 C36 110 40 106 46 106 Z" />
    <path d="M118 94 L172 74 L172 182 L118 162 Z" />
    <path d="M172 74 L172 182" />
    <path d="M176 96 L226 70" />
    <path d="M180 124 L234 124" />
    <path d="M176 152 L226 178" />
    <path d="M62 150 L62 192 C62 198 66 202 72 202 L94 202 C100 202 104 198 104 192 L104 150" />
    <path d="M70 96 L94 96 L94 106 L70 106 Z" />
    <path d="M70 168 L96 168" />
    <path d="M70 182 L96 182" />
  </>
);

export const ART: Record<ArtKey, ReactNode> = {
  jacket,
  bib,
  vestBlaze,
  fleece,
  vestDown,
  crew,
  zipBase,
  boot,
  rubberBoot,
  pack,
  headlamp,
  spotlight,
};

export function ProductArt({
  art,
  className,
  strokeWidth = 3,
}: {
  art: ArtKey;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ART[art]}
    </svg>
  );
}

/** The antler mark used in the header, footer and the field-notes plate. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 28 C11 22 13 16 20 9" />
      <path d="M10 23 C14 23 17 21 19 18.5" />
      <path d="M14 17 C18 17 21 15 23 12.5" />
      <path d="M20 9 C24 7.5 27 7.5 30 9.5" />
    </svg>
  );
}
