import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  GitCompareArrows,
  Layers3,
  Sparkles,
  Star
} from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import { portalCategories } from "@/lib/portal-data";
import styles from "./SmartHome.module.css";

export type HomeArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  alt_text: string | null;
};

export type HomeTool = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  short_description: string | null;
  pricing: string | null;
  rating: number | null;
};

export type HomeModel = {
  id: string;
  name: string;
  slug: string;
  provider: string | null;
  model_type: string | null;
  short_description: string | null;
};

export type HomeComparison = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  item_a_name: string | null;
  item_b_name: string | null;
  verdict: string | null;
};

export type HomePrompt = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  tool_name: string | null;
};

type SmartHomeProps = {
  articles: HomeArticle[];
  tools: HomeTool[];
  models: HomeModel[];
  comparisons: HomeComparison[];
  prompts: HomePrompt[];
};

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
};

function getHomepagePricingLabel(tool: HomeTool) {
  const pricing = tool.pricing?.trim();
  return pricing || "Info harga";
}

function SectionHead({ eyebrow, title, href, linkLabel }: SectionHeadProps) {
  return (
    <div className="sectionHead">
      <div><small>{eyebrow}</small><h2>{title}</h2></div>
      <Link className="textLink" href={href}>
        {linkLabel} <ArrowRight size={17}/>
      </Link>
    </div>
  );
}

export default function SmartHome({
  articles,
  tools,
  models,
  comparisons,
  prompts
}: SmartHomeProps) {
  const hero = articles[0] || null;
  const supportingArticles = articles.slice(1, 5);

  return <main className={styles.home}>
    <section className="smartHero">
      <div className="container smartHeroGrid">
        <div className="smartHeroIntro">
          <div className="eyebrow"><span className="liveDot"/> PORTAL AI INDONESIA</div>
          <h1>Informasi AI yang membantu kamu <em>belajar, bekerja, dan berkembang.</em></h1>
          <p>Artikel dan referensi AI pilihan untuk belajar, bekerja, dan mengambil keputusan.</p>
          <div className="buttons">
            <a className="primary" href="#pilihan">Konten pilihan <ArrowRight size={18}/></a>
            <Link className="secondary" href="/artikel">Semua artikel</Link>
          </div>
          <div className="checks">
            <span><CheckCircle2 size={17}/> Ringkas</span>
            <span><CheckCircle2 size={17}/> Praktis</span>
            <span><CheckCircle2 size={17}/> Terpilih</span>
          </div>
        </div>

        {hero ? <Link href={`/artikel/${hero.slug}`} className="heroStory">
          <div className="heroStoryMedia">
            {hero.cover_image
              ? <img src={hero.cover_image} alt={hero.alt_text||hero.title} width={1200} height={675} decoding="async" fetchPriority="high"/>
              : <div className="heroFallback"><Bot size={72}/></div>}
          </div>
          <div className="heroStoryContent">
            <span>{hero.category}</span>
            <h2>{hero.title}</h2>
            <p>{hero.excerpt}</p>
            <b>Baca artikel <ArrowRight size={17}/></b>
          </div>
        </Link> : <div className="heroStory emptyHero">
          <Bot size={72}/><h2>Artikel unggulan akan tampil di sini.</h2>
        </div>}
      </div>
    </section>

    {supportingArticles.length>0&&<section className="section">
      <div className="container">
        <SectionHead
          eyebrow="ARTIKEL UNGGULAN"
          title="Pilihan utama dari AIUpdateId"
          href="/artikel"
          linkLabel="Lihat semua artikel"
        />
        <div className={`grid ${styles.articleGrid}`}>
          {supportingArticles.map(article=><Link className={styles.articleCard} href={`/artikel/${article.slug}`} key={article.id}>
            <div className={styles.articleMedia}>
              {article.cover_image
                ? <img src={article.cover_image} alt={article.alt_text||article.title} width={640} height={360} loading="lazy" decoding="async"/>
                : <div className={styles.articleFallback}><Bot size={38}/></div>}
              <span>{article.category||"Artikel"}</span>
            </div>
            <div className={styles.articleBody}>
              <h3>{article.title}</h3>
              <b>Baca artikel <ArrowRight size={16}/></b>
            </div>
          </Link>)}
        </div>
      </div>
    </section>}

    <section className={`section ${styles.categorySection}`} id="pilihan">
      <div className="container">
        <SectionHead
          eyebrow="KATEGORI ARTIKEL"
          title="Temukan topik yang kamu butuhkan"
          href="/artikel"
          linkLabel="Buka arsip artikel"
        />
        <div className={styles.categoryGrid}>
          {portalCategories.map(category=><Link href={`/kategori/${category.slug}`} key={category.slug}>
            <span>{category.name}</span><ArrowRight size={17}/>
          </Link>)}
        </div>
      </div>
    </section>

    {tools.length>0&&<section className="section toolsSection">
      <div className="container">
        <SectionHead
          eyebrow="TOOLS AI UNGGULAN"
          title="Alat pilihan untuk bekerja lebih efisien"
          href="/tools"
          linkLabel="Lihat semua tools"
        />
        <div className={`toolGrid ${styles.toolGrid}`}>
          {tools.map(tool=><Link href={`/tools/${tool.slug}`} className="toolCard" key={tool.id}>
            <div className="toolLogo">{tool.name.slice(0,2)}</div>
            <div>
              <small>{tool.category||"AI Tool"}</small>
              <h3>{tool.name}</h3>
              <p>{tool.short_description}</p>
              <div className="toolMeta">
                {tool.rating ? <span><Star size={15}/> {tool.rating}</span> : <span>Unggulan</span>}
                <span>{getHomepagePricingLabel(tool)}</span>
              </div>
            </div>
          </Link>)}
        </div>
      </div>
    </section>}

    {(models.length>0||comparisons.length>0)&&<section className={`section ${styles.referenceSection}`}>
      <div className={`container ${styles.referenceGrid}`}>
        {models.length>0&&<div>
          <SectionHead
            eyebrow="MODEL AI"
            title="Model AI pilihan"
            href="/models"
            linkLabel="Semua model"
          />
          <div className={styles.featureList}>
            {models.map(model=><Link href={`/models/${model.slug}`} key={model.id}>
              <span className={styles.featureIcon}><Layers3 size={19}/></span>
              <div>
                <small>{model.provider||model.model_type||"Model AI"}</small>
                <h3>{model.name}</h3>
                <p>{model.short_description}</p>
              </div>
              <ArrowRight size={17}/>
            </Link>)}
          </div>
        </div>}

        {comparisons.length>0&&<div>
          <SectionHead
            eyebrow="PERBANDINGAN"
            title="Bandingkan sebelum memilih"
            href="/compare"
            linkLabel="Semua perbandingan"
          />
          <div className={styles.featureList}>
            {comparisons.map(comparison=><Link href={`/compare/${comparison.slug}`} key={comparison.id}>
              <span className={styles.featureIcon}><GitCompareArrows size={19}/></span>
              <div>
                <small>{comparison.item_a_name&&comparison.item_b_name
                  ? `${comparison.item_a_name} vs ${comparison.item_b_name}`
                  : "Perbandingan AI"}</small>
                <h3>{comparison.title}</h3>
                <p>{comparison.summary||comparison.verdict}</p>
              </div>
              <ArrowRight size={17}/>
            </Link>)}
          </div>
        </div>}
      </div>
    </section>}

    {prompts.length>0&&<section className={`section ${styles.promptSection}`}>
      <div className="container">
        <SectionHead
          eyebrow="PROMPT UNGGULAN"
          title="Prompt praktis yang siap digunakan"
          href="/prompts"
          linkLabel="Lihat semua prompt"
        />
        <div className={styles.promptGrid}>
          {prompts.map(prompt=><Link href={`/prompts/${prompt.slug}`} key={prompt.id}>
            <span className={styles.featureIcon}><Sparkles size={19}/></span>
            <small>{prompt.category||prompt.tool_name||"Prompt AI"}</small>
            <h3>{prompt.title}</h3>
            <p>{prompt.description}</p>
            <b>Lihat prompt <ArrowRight size={16}/></b>
          </Link>)}
        </div>
      </div>
    </section>}

    <section className="newsletter">
      <div className="container newsletterBox">
        <div><small>NEWSLETTER AIUPDATEID</small><h2>Ringkasan AI pilihan, langsung ke emailmu.</h2><p>Dapatkan pilihan konten penting tanpa harus mencari satu per satu.</p></div>
        <NewsletterForm/>
      </div>
    </section>
  </main>
}
