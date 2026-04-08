export interface Character {
  name: string;
  title: string;
  description: string;
  image?: string;
}

const BASE = "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=619,fit=crop/m7V56PrMDJFy6Dyx/";

export const heroes: Character[] = [
  {
    name: 'Amara "The Innovator"',
    title: "The Innovator",
    description:
      "A tech-savvy rider who combines traditional biking with modern gadgets. Her smart helmet design helps the team stay connected during adventures, and her innovative bike modifications often save the day.",
    image: BASE + "amara-YyvZjbGNeXuM5GQP.jpeg",
  },
  {
    name: 'Zeya "The Tech Whiz"',
    title: "The Tech Whiz",
    description:
      "A coding prodigy who uses her programming skills to create apps that help the team track their routes and monitor bike maintenance. Her digital savvy brings a modern edge to their adventures, though she sometimes needs reminding to look up from her tablet.",
    image: BASE + "zeya-AE0alkzr1GuoR97v.jpeg",
  },
  {
    name: 'Kai "The Daredevil"',
    title: "The Daredevil",
    description:
      "The team's fearless stunt performer who never backs down from a challenge. With natural athletic ability and unwavering confidence, Kai pushes the boundaries of what's possible on two wheels.",
    image: BASE + "kai-AGBn8kNekBcQ2vqk.jpeg",
  },
  {
    name: 'Santiago "The Mechanic"',
    title: "The Mechanic",
    description:
      "A natural problem solver with an intuitive understanding of how things work. Santiago can fix any bike issue and often creates custom modifications to help the team overcome obstacles.",
    image: BASE + "santiago-YBge0kBWnrhWO5zb.jpeg",
  },
  {
    name: 'Logan "The Navigator"',
    title: "The Navigator",
    description:
      "With an exceptional sense of direction and love for exploration, Logan helps the team discover new routes and adventures. Always carries a collection of hand-drawn maps.",
    image: BASE + "logan-YanqX8jp8pF18zr1.jpeg",
  },
  {
    name: 'Cassidy "The Artist"',
    title: "The Artist",
    description:
      "Creative and expressive, Cassidy brings colour to the team by customizing their bikes with unique designs. Her artistic vision helps make each bike as individual as its rider.",
    image: BASE + "cassidy-A85EWK3JyWcV6l06.jpeg",
  },
  {
    name: 'Arjun "The Strategist"',
    title: "The Strategist",
    description:
      "The team's master planner who thinks three steps ahead. Arjun's careful preparation and quick thinking help the team navigate tricky situations.",
    image: BASE + "arjun-AoPqM5kOPviDGxDl.jpeg",
  },
  {
    name: 'Cinnamon "The Peacemaker"',
    title: "The Peacemaker",
    description:
      "The heart of the group who keeps everyone united. Cinnamon's empathy and understanding help resolve conflicts and strengthen team bonds.",
    image: BASE + "cinnamon-m2Wa7w6vglcVrWnw.jpeg",
  },
  {
    name: 'Harper "The Environmentalist"',
    title: "The Environmentalist",
    description:
      "Passionate about nature and conservation, Harper leads the team's eco-friendly initiatives and teaches them about respecting the environment during their adventures.",
    image: BASE + "harper-dOq8Bk25G6fxGvKZ.jpeg",
  },
  {
    name: 'Ethan "The Entertainer"',
    title: "The Entertainer",
    description:
      "Always ready with a joke or funny story, Ethan keeps spirits high during challenging rides. His positive energy is contagious and helps the team stay motivated.",
    image: BASE + "ethan-mjEqlaW3WpTqQ0eg.jpeg",
  },
  {
    name: 'Hiro "The Inventor"',
    title: "The Inventor",
    description:
      "A brilliant mind who creates innovative bike accessories from recycled materials. Hiro's inventions often have unexpected but helpful features.",
    image: BASE + "hiro-m7V564onNPTq6Dea.jpeg",
  },
  {
    name: 'Kofi "The Musician"',
    title: "The Musician",
    description:
      "Brings rhythm to the team's rides with his beat-boxing and improvised songs. Kofi's music helps coordinate group movements and adds fun to every adventure.",
    image: BASE + "kofi-mP42akoEqXUzODZ6.jpeg",
  },
  {
    name: 'Maddison "The Leader"',
    title: "The Leader",
    description:
      "Natural-born leader who brings out the best in everyone. Maddison's strong sense of responsibility and care for others makes her a respected figure in the group.",
    image: BASE + "maddison-AMqlekPLNVtaeV6D.jpeg",
  },
  {
    name: 'Leilani "The Naturalist"',
    title: "The Naturalist",
    description:
      "An expert in local flora and fauna, Leilani helps the team safely navigate through nature and teaches them about the wildlife they encounter.",
    image: BASE + "leilani-dJo5MkqaPjcQQqjx.jpeg",
  },
  {
    name: 'Mateo "The Storyteller"',
    title: "The Storyteller",
    description:
      "Gifted with imagination, Mateo turns every ride into an epic adventure through his storytelling. His tales inspire the team to push their boundaries.",
    image: BASE + "mateo-AR0MxkqvzWcx4e9b.jpeg",
  },
  {
    name: 'Nia "The Scientist"',
    title: "The Scientist",
    description:
      "Curious and analytical, Nia studies the physics of biking to help the team improve their techniques. Her experiments often lead to interesting discoveries.",
    image: BASE + "nia-YanqX8jpK4fnrWg6.jpeg",
  },
  {
    name: 'Yara "The Athlete"',
    title: "The Athlete",
    description:
      "A natural athlete who helps train the team in fitness and endurance. Yara's training programs help everyone become stronger and more skilled riders.",
    image: BASE + "yara-YX4avkNjz2t9opMR.jpeg",
  },
  {
    name: 'Wyatt "The Historian"',
    title: "The Historian",
    description:
      "Fascinated by local history, Wyatt guides the team to interesting historical locations and shares stories about the neighbourhood's past.",
    image: BASE + "wyatt-YZ9xqk4EqBu2kw4R.jpeg",
  },
];

export const villains: Character[] = [
  {
    name: "Grumble Gnome",
    title: "Grumble Gnome",
    description:
      "A grouchy garden gnome who believes bikes ruin his perfectly manicured lawn. Sets up elaborate traps to protect his territory from The Biker Babies.",
    image: BASE + "grumble-gnome-mnlqDjBaloFypJM0.jpeg",
  },
  {
    name: "Grumpy Gearhead",
    title: "Grumpy Gearhead",
    description:
      "A cranky former bike shop owner who creates mechanical obstacles for the team. Deep down, he's impressed by their skills but too proud to admit it.",
    image: BASE + "grumpy-gearhead-YyvZjbGpJvTRlWL2.jpeg",
  },
  {
    name: "Blaze",
    title: "Blaze",
    description:
      "A retired stunt rider with a fiery obsession, who thrives on danger and drama. He views The Biker Babies as obstacles to reignite his glory days.",
    image: BASE + "blaze-Y4LxzQaNqwTzbP94.jpeg",
  },
  {
    name: "Sir Stop-Alot",
    title: "Sir Stop-Alot",
    description:
      "A self-appointed crossing guard who takes his job way too seriously. His elaborate traffic rules and random stop signs create chaos for The Biker Babies.",
    image: BASE + "sir-stop-alot-YbNqQ2xl1etZKe0Z.jpeg",
  },
  {
    name: "Turbo Toad",
    title: "Turbo Toad",
    description:
      "A speed-obsessed amphibian who rides a souped-up pogo stick. Constantly tries to prove that hopping is better than biking.",
    image: BASE + "turbo-toad-A1aBEbjpb5iPnkyN.jpeg",
  },
  {
    name: "Slick Sally",
    title: "Slick Sally",
    description:
      "A playful troublemaker who turns her love of slime into gooey obstacles for The Biker Babies.",
    image: BASE + "slick-sally-mP42akorbLfJQGBl.jpeg",
  },
  {
    name: "Count Crankshaft",
    title: "Count Crankshaft",
    description:
      "An eccentric inventor who creates bizarre anti-bike devices. His contraptions never work as planned, often backfiring in comical ways.",
    image: BASE + "count-crankshaft-YX4avkNJD0IPM3PP.jpeg",
  },
  {
    name: "The Flat Tyre Gang",
    title: "The Flat Tyre Gang",
    description:
      "A mischievous group of porcupines who drop spikes on bike paths. They think it's hilarious, but The Biker Babies always have to watch out for their pranks.",
    image: BASE + "the-flat-tyre-gang-AMqlekPZNeulzJ7k.jpeg",
  },
  {
    name: "Scorch",
    title: "Scorch",
    description:
      "Blaze's equally daring young son, eager to follow in his father's fiery footsteps. Though smaller in size, Scorch is bold and mischievous.",
    image: BASE + "scorch-mxBMLnkNLVi6zp4e.jpeg",
  },
  {
    name: "Grease Goblin",
    title: "Grease Goblin",
    description:
      "A sneaky creature who lives in the storm drains and collects broken bike parts. Sometimes helps the team in exchange for shiny new bike bells.",
    image: BASE + "grease-goblin-dOq8Bk2LEgSo7Vkm.jpeg",
  },
];
