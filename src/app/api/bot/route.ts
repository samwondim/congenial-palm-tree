import { Telegraf, Scenes, session } from "telegraf";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase env vars");
  }
  return createClient(supabaseUrl, supabaseKey);
}

function getBot() {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    throw new Error("Missing BOT_TOKEN");
  }
  return new Telegraf(botToken);
}

const generateSlug = (name1: string, name2: string) => {
  const combined = `${name1}-${name2}`.toLowerCase();
  return combined.replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
};

const createWeddingScene = new Scenes.WizardScene(
  "create-wedding",
  (ctx: any) => {
    ctx.reply("💍 Welcome to Wedding Builder! Let's create your wedding site.\n\nFirst, what's the first partner's name? (e.g., Sarah)");
    return ctx.wizard.next();
  },
  (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid name.");
      return;
    }
    ctx.session.name1 = ctx.message.text.trim();
    ctx.reply(`Great! And the second partner's name? (e.g., James)`);
    return ctx.wizard.next();
  },
  (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid name.");
      return;
    }
    ctx.session.name2 = ctx.message.text.trim();
    ctx.reply(`Perfect! ${ctx.session.name1} & ${ctx.session.name2} 💕\n\nWhat's your wedding date? (format: YYYY-MM-DD, e.g., 2026-09-15)`);
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid date.");
      return;
    }
    ctx.session.weddingDate = ctx.message.text.trim();
    
    const slug = generateSlug(ctx.session.name1, ctx.session.name2);
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("couples")
      .insert({
        slug,
        name1: ctx.session.name1,
        name2: ctx.session.name2,
        wedding_date: ctx.session.weddingDate,
        telegram_chat_id: ctx.message.from.id,
        status: "draft",
      })
      .select()
      .single();
    
    if (error) {
      ctx.reply(`Error creating wedding: ${error.message}`);
      return ctx.scene.leave();
    }
    
    ctx.session.coupleId = data.id;
    ctx.session.slug = slug;
    
    ctx.reply("Almost done! What's the ceremony venue name? (e.g., St. Mary's Cathedral)");
    return ctx.wizard.next();
  },
  (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid venue name.");
      return;
    }
    ctx.session.venueCeremonyName = ctx.message.text.trim();
    ctx.reply("And the ceremony venue address? (e.g., 123 Church Street, San Francisco, CA)");
    return ctx.wizard.next();
  },
  (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid address.");
      return;
    }
    ctx.session.venueCeremonyAddress = ctx.message.text.trim();
    ctx.reply("What time is the ceremony? (e.g., 2:00 PM)");
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid time.");
      return;
    }
    ctx.session.venueCeremonyTime = ctx.message.text.trim();
    const supabase = getSupabase();
    
    await supabase
      .from("couples")
      .update({
        venues: {
          ceremony: {
            name: ctx.session.venueCeremonyName,
            address: ctx.session.venueCeremonyAddress,
            time: ctx.session.venueCeremonyTime,
            city: ctx.session.venueCeremonyAddress,
            description: "Ceremony location",
          },
          reception: {
            name: ctx.session.venueCeremonyName,
            address: ctx.session.venueCeremonyAddress,
            time: ctx.session.venueCeremonyTime,
            city: ctx.session.venueCeremonyAddress,
            description: "Reception location",
          },
        },
      })
      .eq("id", ctx.session.coupleId);
    
    ctx.reply("What's the reception venue name? (e.g., The Grand Ballroom)");
    return ctx.wizard.next();
  },
  (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid venue name.");
      return;
    }
    ctx.session.venueReceptionName = ctx.message.text.trim();
    ctx.reply("And the reception venue address?");
    return ctx.wizard.next();
  },
  (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid address.");
      return;
    }
    ctx.session.venueReceptionAddress = ctx.message.text.trim();
    ctx.reply("What time is the reception? (e.g., 5:00 PM)");
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid time.");
      return;
    }
    ctx.session.venueReceptionTime = ctx.message.text.trim();
    const supabase = getSupabase();
    
    await supabase
      .from("couples")
      .update({
        venues: {
          ceremony: {
            name: ctx.session.venueCeremonyName,
            address: ctx.session.venueCeremonyAddress,
            time: ctx.session.venueCeremonyTime,
            city: ctx.session.venueCeremonyAddress,
            description: "Ceremony location",
          },
          reception: {
            name: ctx.session.venueReceptionName,
            address: ctx.session.venueReceptionAddress,
            time: ctx.session.venueReceptionTime,
            city: ctx.session.venueReceptionAddress,
            description: "Reception location",
          },
        },
        status: "published",
      })
      .eq("id", ctx.session.coupleId);
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://congenial-palm-tree-tawny.vercel.app";
    
    ctx.reply(
      `🎉 Congratulations! Your wedding site is ready!\n\n` +
      `View it at: ${siteUrl}/${ctx.session.slug}\n\n` +
      `Want to add more details? Use /edit to modify your site.`
    );
    
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([createWeddingScene]);

const bot = getBot();
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: any) => {
  ctx.reply(
    "💍 Welcome to Wedding Builder!\n\n" +
    "I help you create a beautiful wedding website.\n\n" +
    "Commands:\n" +
    "/start - Create a new wedding site\n" +
    "/edit - Edit your existing wedding\n" +
    "/help - Get help"
  );
});

bot.command("start", (ctx: any) => {
  ctx.scene.enter("create-wedding");
});

bot.command("help", (ctx: any) => {
  ctx.reply(
    "Need help? Here's how to use Wedding Builder:\n\n" +
    "1. Run /start to create a new wedding site\n" +
    "2. Follow the prompts to enter your details\n" +
    "3. Your site will be created and published automatically\n" +
    "4. Use /edit to make changes later\n\n" +
    "Questions? Contact support."
  );
});

bot.catch((err: any, ctx: any) => {
  console.error("Bot error:", err);
  ctx.reply("Something went wrong. Please try again or use /start.");
});

export async function POST(request: Request) {
  try {
    await bot.handleUpdate(await request.json());
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("OK", { status: 200 });
}