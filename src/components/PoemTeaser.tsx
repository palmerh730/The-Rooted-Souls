import { FunctionComponent, useState } from "react";
import styles from "./PoemTeaser.module.css";

export type PoemTeaserType = {
  className?: string;
};

interface Poem {
  title: string;
  lines: string;
  italicIntro?: string;
}

const POEMS: Poem[] = [
  {
    title: "Bonsai",
    lines: `My poetry style is Bonsai,
Starting with the words,

Overgrown and stylised,
Then pruned to lose the merde

Leave the French poets to the flowers,
Or the romantic verbs of Keats;
Removing my verbal towers,
To reveal what's underneath.

My pen becomes the clipper,
Of the word cut here or there;
Less sculptor, more chipper,
Away from pretentious glare.`
  },
  {
    title: "Measuring Our Dreams",
    italicIntro: `"Covered in the cloak of silence,\nI hear you talkin' in my head,"`,
    lines: `Sings Shane MacGowan,
Poetically crowned,
The best to put paper with lead.

Singing lonely and solo,
Transported to Soho,
Rainy night here in my room.

Love, loss, and care tossed,
But never to be glossed;
The King of the lovesick and doomed.`
  },
  {
    title: "Sunday",
    lines: `Lying here in dead of night,
Just woken from the deep;
Thinking of the years at this time,
Insomnia stealing sleep.

Or even worse,
The hangover birth,
From the odd night of fun.

But with 3 a.m. wake,
No productive take,
The fear would have just begun.

From now til dawn,
This time becomes,
My most productive write.

No racing mind,
Mindful and kind,
Just ideas that now bite.

To put pen to page,
What's in my head;
New or old thoughts fight,

To be a poem,
For the next tome,
Any good or shite?

Is it cathartic?
This wholesome shift,
From mental block to writing?

What I know,
Of this new flow,
Is the contentment it’s providing.`
  }
];

const PoemTeaser: FunctionComponent<PoemTeaserType> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section
      className={[styles.section, className].join(" ")}
      data-scroll-to="teaserPoems"
    >
      <div className={styles.header}>
        <div className={styles.tagline}>Selected Verses</div>
        <h2 className={styles.title}>
          <span>Whispers of the </span>
          <span className={styles.highlight}>Soul</span>
        </h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.tabsContainer}>
        {POEMS.map((poem, index) => (
          <button
            key={index}
            className={[
              styles.tab,
              activeTab === index ? styles.activeTab : ""
            ].join(" ")}
            onClick={() => setActiveTab(index)}
          >
            {poem.title}
          </button>
        ))}
      </div>

      <div className={styles.poemCard} key={activeTab}>
        <h3 className={styles.poemTitle}>{POEMS[activeTab].title}</h3>
        <div className={styles.poemBody}>
          {POEMS[activeTab].italicIntro && (
            <p className={styles.italicIntro}>
              {POEMS[activeTab].italicIntro}
            </p>
          )}
          <p className={styles.poemText}>{POEMS[activeTab].lines}</p>
        </div>
      </div>
    </section>
  );
};

export default PoemTeaser;
