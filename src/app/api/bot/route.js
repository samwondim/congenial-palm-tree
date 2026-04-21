import { Telegraf, Scenes, session } from "telegraf";
import { createClient } from "@supabase/supabase-js";

// @ts-expect-error - env vars loaded at runtime
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase env vars");
  }
  return createClient(supabaseUrl, supabaseKey);
}

// @ts-expect-error - env vars loaded at runtime
function getBot() {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    throw new Error("Missing BOT_TOKEN");
  }
  return new Telegraf(botToken);
}

function generateSlug(name1, name2) {
  const combined = `${name1}-${name2}`.toLowerCase();
  return combined.replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
}

// @ts-expect-error - telegraf typing issues
const createWeddingScene = new Scenes.WizardScene(
  "create-wedding",
  (ctx) => {
    ctx.reply("💍 Welcome to Wedding Builder! Let's create your wedding site.\n\nFirst, what's the first partner's name? (e.g., Sarah)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid name.");
      return;
    }
    ctx.session.name1 = ctx.message.text.trim();
    ctx.reply(`Great! And the second partner's name? (e.g., James)`);
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid name.");
      return;
    }
    ctx.session.name2 = ctx.message.text.trim();
    ctx.reply(`Perfect! ${ctx.session.name1} & ${ctx.session.name2} 💕\n\nWhat's your wedding date? (format: YYYY-MM-DD, e.g., 2026-09-15)`);
    return ctx.wizard.next();
  },
  async (ctx) => {
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
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid venue name.");
      return;
    }
    ctx.session.venueCeremonyName = ctx.message.text.trim();
    ctx.reply("And the ceremony venue address? (e.g., 123 Church Street, San Francisco, CA)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid address.");
      return;
    }
    ctx.session.venueCeremonyAddress = ctx.message.text.trim();
    ctx.reply("What time is the ceremony? (e.g., 2:00 PM)");
    return ctx.wizard.next();
  },
  async (ctx) => {
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
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid venue name.");
      return;
    }
    ctx.session.venueReceptionName = ctx.message.text.trim();
    ctx.reply("And the reception venue address?");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a valid address.");
      return;
    }
    ctx.session.venueReceptionAddress = ctx.message.text.trim();
    ctx.reply("What time is the reception? (e.g., 5:00 PM)");
    return ctx.wizard.next();
  },
  async (ctx) => {
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

// @ts-expect-error - telegraf typing issues
const editMenuScene = new Scenes.WizardScene(
  "edit-menu",
  (ctx) => {
    ctx.reply(
      "✏️ What would you like to edit?\n\n" +
      "1. Story / Love Timeline\n" +
      "2. Schedule / Timeline\n" +
      "3. FAQ\n" +
      "4. Registry\n" +
      "5. Photos (upload new)\n\n" +
      "Type the number of your choice."
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please type a number (1-5).");
      return;
    }
    const choice = ctx.message.text.trim();
    
    if (choice === "1") {
      ctx.scene.enter("edit-story");
    } else if (choice === "2") {
      ctx.scene.enter("edit-schedule");
    } else if (choice === "3") {
      ctx.scene.enter("edit-faq");
    } else if (choice === "4") {
      ctx.scene.enter("edit-registry");
    } else if (choice === "5") {
      ctx.reply("📷 Just send me a photo and I'll upload it to your wedding site!");
      return ctx.scene.leave();
    } else {
      ctx.reply("Please type a number between 1 and 5.");
    }
  }
);

// @ts-expect-error - telegraf typing issues
const editStoryScene = new Scenes.WizardScene(
  "edit-story",
  (ctx) => {
    ctx.reply("📖 Add a story item!\n\nWhat's the year? (e.g., 2018)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a year.");
      return;
    }
    ctx.session.storyYear = ctx.message.text.trim();
    ctx.reply("What's the title? (e.g., We Met)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a title.");
      return;
    }
    ctx.session.storyTitle = ctx.message.text.trim();
    ctx.reply("What's the description?");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a description.");
      return;
    }
    ctx.session.storyDescription = ctx.message.text.trim();
    const supabase = getSupabase();
    const chatId = ctx.message.from.id;
    
    const { data: couple } = await supabase
      .from("couples")
      .select("story")
      .eq("telegram_chat_id", chatId)
      .single();
    
    if (!couple) {
      ctx.reply("No wedding found. Use /start to create one.");
      return ctx.scene.leave();
    }
    
    const newStory = [
      ...(couple.story || []),
      {
        year: ctx.session.storyYear,
        title: ctx.session.storyTitle,
        description: ctx.session.storyDescription,
      },
    ];
    
    await supabase.from("couples").update({ story: newStory }).eq("telegram_chat_id", chatId);
    
    ctx.reply(`✅ Added: ${ctx.session.storyYear} - ${ctx.session.storyTitle}\n\nWant to add more? Use /edit`);
    return ctx.scene.leave();
  }
);

// @ts-expect-error - telegraf typing issues
const editScheduleScene = new Scenes.WizardScene(
  "edit-schedule",
  (ctx) => {
    ctx.reply("📅 Add a schedule item!\n\nWhat's the time? (e.g., 2:00 PM)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a time.");
      return;
    }
    ctx.session.scheduleTime = ctx.message.text.trim();
    ctx.reply("What's the event? (e.g., Ceremony)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter an event.");
      return;
    }
    ctx.session.scheduleEvent = ctx.message.text.trim();
    ctx.reply("What's the location?");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a location.");
      return;
    }
    ctx.session.scheduleLocation = ctx.message.text.trim();
    ctx.reply("What's the description?");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a description.");
      return;
    }
    ctx.session.scheduleDescription = ctx.message.text.trim();
    const supabase = getSupabase();
    const chatId = ctx.message.from.id;
    
    const { data: couple } = await supabase
      .from("couples")
      .select("schedule")
      .eq("telegram_chat_id", chatId)
      .single();
    
    if (!couple) {
      ctx.reply("No wedding found. Use /start to create one.");
      return ctx.scene.leave();
    }
    
    const newSchedule = [
      ...(couple.schedule || []),
      {
        time: ctx.session.scheduleTime,
        event: ctx.session.scheduleEvent,
        location: ctx.session.scheduleLocation,
        description: ctx.session.scheduleDescription,
      },
    ];
    
    await supabase.from("couples").update({ schedule: newSchedule }).eq("telegram_chat_id", chatId);
    
    ctx.reply(`✅ Added: ${ctx.session.scheduleTime} - ${ctx.session.scheduleEvent}\n\nWant to add more? Use /edit`);
    return ctx.scene.leave();
  }
);

// @ts-expect-error - telegraf typing issues
const editFaqScene = new Scenes.WizardScene(
  "edit-faq",
  (ctx) => {
    ctx.reply("❓ Add an FAQ!\n\nWhat's the question?");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a question.");
      return;
    }
    ctx.session.faqQuestion = ctx.message.text.trim();
    ctx.reply("What's the answer?");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter an answer.");
      return;
    }
    ctx.session.faqAnswer = ctx.message.text.trim();
    const supabase = getSupabase();
    const chatId = ctx.message.from.id;
    
    const { data: couple } = await supabase
      .from("couples")
      .select("faq")
      .eq("telegram_chat_id", chatId)
      .single();
    
    if (!couple) {
      ctx.reply("No wedding found. Use /start to create one.");
      return ctx.scene.leave();
    }
    
    const newFaq = [
      ...(couple.faq || []),
      {
        question: ctx.session.faqQuestion,
        answer: ctx.session.faqAnswer,
      },
    ];
    
    await supabase.from("couples").update({ faq: newFaq }).eq("telegram_chat_id", chatId);
    
    ctx.reply(`✅ Added FAQ: ${ctx.session.faqQuestion}\n\nWant to add more? Use /edit`);
    return ctx.scene.leave();
  }
);

// @ts-expect-error - telegraf typing issues
const editRegistryScene = new Scenes.WizardScene(
  "edit-registry",
  (ctx) => {
    ctx.reply("🎁 Add a registry item!\n\nWhat's the store name? (e.g., Crate & Barrel)");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a store name.");
      return;
    }
    ctx.session.registryName = ctx.message.text.trim();
    ctx.reply("What's the URL? (e.g., https://www.crateandbarrel.com)");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply("Please enter a URL.");
      return;
    }
    ctx.session.registryUrl = ctx.message.text.trim();
    const supabase = getSupabase();
    const chatId = ctx.message.from.id;
    
    const { data: couple } = await supabase
      .from("couples")
      .select("registry")
      .eq("telegram_chat_id", chatId)
      .single();
    
    if (!couple) {
      ctx.reply("No wedding found. Use /start to create one.");
      return ctx.scene.leave();
    }
    
    const newRegistry = [
      ...(couple.registry || []),
      {
        name: ctx.session.registryName,
        url: ctx.session.registryUrl,
      },
    ];
    
    await supabase.from("couples").update({ registry: newRegistry }).eq("telegram_chat_id", chatId);
    
    ctx.reply(`✅ Added: ${ctx.session.registryName}\n\nWant to add more? Use /edit`);
    return ctx.scene.leave();
  }
);

// @ts-expect-error - telegraf typing issues
const stage = new Scenes.Stage([
  createWeddingScene,
  editMenuScene,
  editStoryScene,
  editScheduleScene,
  editFaqScene,
  editRegistryScene,
]);

const bot = getBot();
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply(
    "💍 Welcome to Wedding Builder!\n\n" +
    "I help you create a beautiful wedding website.\n\n" +
    "Commands:\n" +
    "/start - Create a new wedding site\n" +
    "/edit - Edit your existing wedding\n" +
    "/help - Get help"
  );
});

bot.command("start", (ctx) => {
  ctx.scene.enter("create-wedding");
});

bot.command("edit", async (ctx) => {
  const chatId = ctx.message.from.id;
  const supabase = getSupabase();
  
  const { data: couple } = await supabase
    .from("couples")
    .select("*")
    .eq("telegram_chat_id", chatId)
    .single();
  
  if (!couple) {
    ctx.reply("You don't have a wedding site yet. Use /start to create one!");
    return;
  }
  
  ctx.session.coupleId = couple.id;
  ctx.session.slug = couple.slug;
  ctx.session.name1 = couple.name1;
  ctx.session.name2 = couple.name2;
  
  ctx.scene.enter("edit-menu");
});

bot.command("help", (ctx) => {
  ctx.reply(
    "Need help? Here's how to use Wedding Builder:\n\n" +
    "1. Run /start to create a new wedding site\n" +
    "2. Follow the prompts to enter your details\n" +
    "3. Your site will be created and published automatically\n" +
    "4. Use /edit to add more details (Story, Schedule, FAQ, Registry)\n" +
    "5. Send photos directly to upload them\n\n" +
    "Questions? Contact support."
  );
});

// @ts-expect-error - telegraf typing issues
bot.on("photo", async (ctx) => {
  const chatId = ctx.message.from.id;
  const supabase = getSupabase();
  
  const { data: couple } = await supabase
    .from("couples")
    .select("photos")
    .eq("telegram_chat_id", chatId)
    .single();
  
  if (!couple) {
    ctx.reply("You don't have a wedding site yet. Use /start to create one!");
    return;
  }
  
  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  const file = await ctx.telegram.getFile(photo.file_id);
  const botToken = process.env.BOT_TOKEN;
  
  const response = await fetch(`https://api.telegram.org/file/bot${botToken}/${file.file_path}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // @ts-expect-error - env vars loaded at runtime
  const storage = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  
  const fileName = `${couple.slug}/${Date.now()}.jpg`;
  
  const { error: uploadError } = await storage.storage
    .from("wedding-photos")
    .upload(fileName, buffer);
  
  if (uploadError) {
    ctx.reply(`Error uploading photo: ${uploadError.message}`);
    return;
  }
  
  const { data: urlData } = storage.storage
    .from("wedding-photos")
    .getPublicUrl(fileName);
  
  const newPhotos = [
    ...(couple.photos || []),
    {
      id: Date.now(),
      src: urlData.publicUrl,
      alt: "Wedding photo",
      category: "couple",
    },
  ];
  
  await supabase.from("couples").update({ photos: newPhotos }).eq("telegram_chat_id", chatId);
  
  ctx.reply("✅ Photo uploaded! View your site to see it.");
});

bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("Something went wrong. Please try again or use /start.");
});

export async function POST(request) {
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