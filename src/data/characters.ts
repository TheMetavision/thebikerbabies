export interface Character {
  name: string;
  title: string;
  description: string;
  image?: string;
}


export const heroes: Character[] = [
  {
    name: 'Amara "The Innovator"',
    title: "The Innovator",
    description:
      "A tech-savvy rider who combines traditional biking with modern gadgets. Her smart helmet design helps the team stay connected during adventures, and her innovative bike modifications often save the day.",
    image: "https://cdn.sanity.io/images/v518t53u/production/a4ff3fcea5a5dac49bb5c98f173ca302ca44f4fe-896x1344.jpg",
  },
  {
    name: 'Zeya "The Tech Whiz"',
    title: "The Tech Whiz",
    description:
      "A coding prodigy who uses her programming skills to create apps that help the team track their routes and monitor bike maintenance. Her digital savvy brings a modern edge to their adventures, though she sometimes needs reminding to look up from her tablet.",
    image: "https://cdn.sanity.io/images/v518t53u/production/fe40965f86bf24f3576a40094b9bc478ecd46291-896x1344.jpg",
  },
  {
    name: 'Kai "The Daredevil"',
    title: "The Daredevil",
    description:
      "The team's fearless stunt performer who never backs down from a challenge. With natural athletic ability and unwavering confidence, Kai pushes the boundaries of what's possible on two wheels.",
    image: "https://cdn.sanity.io/images/v518t53u/production/e798d587764458a89ab804daf5888fbf06b60b11-896x1344.jpg",
  },
  {
    name: 'Santiago "The Mechanic"',
    title: "The Mechanic",
    description:
      "A natural problem solver with an intuitive understanding of how things work. Santiago can fix any bike issue and often creates custom modifications to help the team overcome obstacles.",
    image: "https://cdn.sanity.io/images/v518t53u/production/d9e07da8d9b314e4e11515021524d122496569dc-896x1344.jpg",
  },
  {
    name: 'Logan "The Navigator"',
    title: "The Navigator",
    description:
      "With an exceptional sense of direction and love for exploration, Logan helps the team discover new routes and adventures. Always carries a collection of hand-drawn maps.",
    image: "https://cdn.sanity.io/images/v518t53u/production/f4808911ecb140f5d997d557e75a88227b260bd2-896x1344.jpg",
  },
  {
    name: 'Cassidy "The Artist"',
    title: "The Artist",
    description:
      "Creative and expressive, Cassidy brings colour to the team by customizing their bikes with unique designs. Her artistic vision helps make each bike as individual as its rider.",
    image: "https://cdn.sanity.io/images/v518t53u/production/e533dff08eb627678add9008884a9018447b42c7-896x1344.jpg",
  },
  {
    name: 'Arjun "The Strategist"',
    title: "The Strategist",
    description:
      "The team's master planner who thinks three steps ahead. Arjun's careful preparation and quick thinking help the team navigate tricky situations.",
    image: "https://cdn.sanity.io/images/v518t53u/production/6d519d67bca82ad8eee0cf6b5e2c73a974fb1f2a-896x1344.jpg",
  },
  {
    name: 'Cinnamon "The Peacemaker"',
    title: "The Peacemaker",
    description:
      "The heart of the group who keeps everyone united. Cinnamon's empathy and understanding help resolve conflicts and strengthen team bonds.",
    image: "https://cdn.sanity.io/images/v518t53u/production/cc392eb397705f6c4850cd3764ae390d3cb50334-896x1344.jpg",
  },
  {
    name: 'Harper "The Environmentalist"',
    title: "The Environmentalist",
    description:
      "Passionate about nature and conservation, Harper leads the team's eco-friendly initiatives and teaches them about respecting the environment during their adventures.",
    image: "https://cdn.sanity.io/images/v518t53u/production/d8aeef24d296ff9edf49a9bf9fae44b2438968bd-896x1344.jpg",
  },
  {
    name: 'Ethan "The Entertainer"',
    title: "The Entertainer",
    description:
      "Always ready with a joke or funny story, Ethan keeps spirits high during challenging rides. His positive energy is contagious and helps the team stay motivated.",
    image: "https://cdn.sanity.io/images/v518t53u/production/3d93901440bd2894d0965f82941a1d6433a90dde-896x1344.jpg",
  },
  {
    name: 'Hiro "The Inventor"',
    title: "The Inventor",
    description:
      "A brilliant mind who creates innovative bike accessories from recycled materials. Hiro's inventions often have unexpected but helpful features.",
    image: "https://cdn.sanity.io/images/v518t53u/production/ba0823668c6079709fcf90298679bafcb55b6498-896x1344.jpg",
  },
  {
    name: 'Kofi "The Musician"',
    title: "The Musician",
    description:
      "Brings rhythm to the team's rides with his beat-boxing and improvised songs. Kofi's music helps coordinate group movements and adds fun to every adventure.",
    image: "https://cdn.sanity.io/images/v518t53u/production/ebc72ab60993cba6b47c7f7e1e83dc08636c7216-896x1344.jpg",
  },
  {
    name: 'Maddison "The Leader"',
    title: "The Leader",
    description:
      "Natural-born leader who brings out the best in everyone. Maddison's strong sense of responsibility and care for others makes her a respected figure in the group.",
    image: "https://cdn.sanity.io/images/v518t53u/production/d05ade00220f9cc6ce8ccb5c619c79e76bca9c33-896x1344.jpg",
  },
  {
    name: 'Leilani "The Naturalist"',
    title: "The Naturalist",
    description:
      "An expert in local flora and fauna, Leilani helps the team safely navigate through nature and teaches them about the wildlife they encounter.",
    image: "https://cdn.sanity.io/images/v518t53u/production/69eb2564a3625f6701d9a686bbcf664405361416-896x1344.jpg",
  },
  {
    name: 'Mateo "The Storyteller"',
    title: "The Storyteller",
    description:
      "Gifted with imagination, Mateo turns every ride into an epic adventure through his storytelling. His tales inspire the team to push their boundaries.",
    image: "https://cdn.sanity.io/images/v518t53u/production/ec21a08a54e77afe589d54125ff80d7bfcbd756e-896x1344.jpg",
  },
  {
    name: 'Nia "The Scientist"',
    title: "The Scientist",
    description:
      "Curious and analytical, Nia studies the physics of biking to help the team improve their techniques. Her experiments often lead to interesting discoveries.",
    image: "https://cdn.sanity.io/images/v518t53u/production/329280d9f03935c7b87bdc3f1121228d7e847454-896x1344.jpg",
  },
  {
    name: 'Yara "The Athlete"',
    title: "The Athlete",
    description:
      "A natural athlete who helps train the team in fitness and endurance. Yara's training programs help everyone become stronger and more skilled riders.",
    image: "https://cdn.sanity.io/images/v518t53u/production/8cb6dd8ba84778a4386f48c3cbf4367d6f823b7b-896x1344.jpg",
  },
  {
    name: 'Wyatt "The Historian"',
    title: "The Historian",
    description:
      "Fascinated by local history, Wyatt guides the team to interesting historical locations and shares stories about the neighbourhood's past.",
    image: "https://cdn.sanity.io/images/v518t53u/production/b52082d401bea69fe9e96a2810c8a8d877245947-896x1344.jpg",
  },
];

export const villains: Character[] = [
  {
    name: "Grumble Gnome",
    title: "Grumble Gnome",
    description:
      "A grouchy garden gnome who believes bikes ruin his perfectly manicured lawn. Sets up elaborate traps to protect his territory from The Biker Babies.",
    image: "https://cdn.sanity.io/images/v518t53u/production/ebe14e65b41cfa1d696debc7f58474d7152c0105-896x1344.jpg",
  },
  {
    name: "Grumpy Gearhead",
    title: "Grumpy Gearhead",
    description:
      "A cranky former bike shop owner who creates mechanical obstacles for the team. Deep down, he's impressed by their skills but too proud to admit it.",
    image: "https://cdn.sanity.io/images/v518t53u/production/76b54685c4b40514575f3a4ac1f58d6c0e30c39c-896x1344.jpg",
  },
  {
    name: "Blaze",
    title: "Blaze",
    description:
      "A retired stunt rider with a fiery obsession, who thrives on danger and drama. He views The Biker Babies as obstacles to reignite his glory days.",
    image: "https://cdn.sanity.io/images/v518t53u/production/2760cb4428c2a385bd22630aaed03071c51ed706-896x1344.jpg",
  },
  {
    name: "Sir Stop-Alot",
    title: "Sir Stop-Alot",
    description:
      "A self-appointed crossing guard who takes his job way too seriously. His elaborate traffic rules and random stop signs create chaos for The Biker Babies.",
    image: "https://cdn.sanity.io/images/v518t53u/production/29fbc442d782baecc4ab0af784b71c0eddf0a4dd-896x1344.jpg",
  },
  {
    name: "Turbo Toad",
    title: "Turbo Toad",
    description:
      "A speed-obsessed amphibian who rides a souped-up pogo stick. Constantly tries to prove that hopping is better than biking.",
    image: "https://cdn.sanity.io/images/v518t53u/production/e8cc59182ea9c1329224959e8cf6886de042c92a-896x1344.jpg",
  },
  {
    name: "Slick Sally",
    title: "Slick Sally",
    description:
      "A playful troublemaker who turns her love of slime into gooey obstacles for The Biker Babies.",
    image: "https://cdn.sanity.io/images/v518t53u/production/de744803530c210ef6a42ac622fc197bde6f3d40-896x1344.jpg",
  },
  {
    name: "Count Crankshaft",
    title: "Count Crankshaft",
    description:
      "An eccentric inventor who creates bizarre anti-bike devices. His contraptions never work as planned, often backfiring in comical ways.",
    image: "https://cdn.sanity.io/images/v518t53u/production/3d95113e479f5b6672a09048c3c166a3fe3d78c0-896x1344.jpg",
  },
  {
    name: "The Flat Tyre Gang",
    title: "The Flat Tyre Gang",
    description:
      "A mischievous group of porcupines who drop spikes on bike paths. They think it's hilarious, but The Biker Babies always have to watch out for their pranks.",
    image: "https://cdn.sanity.io/images/v518t53u/production/433a507735684c8da0e5b89c5f68444f357b09ea-896x1344.jpg",
  },
  {
    name: "Scorch",
    title: "Scorch",
    description:
      "Blaze's equally daring young son, eager to follow in his father's fiery footsteps. Though smaller in size, Scorch is bold and mischievous.",
    image: "https://cdn.sanity.io/images/v518t53u/production/3ba54d43f0e527ee7d827f583fdf82bf0d65d6f3-896x1344.jpg",
  },
  {
    name: "Grease Goblin",
    title: "Grease Goblin",
    description:
      "A sneaky creature who lives in the storm drains and collects broken bike parts. Sometimes helps the team in exchange for shiny new bike bells.",
    image: "https://cdn.sanity.io/images/v518t53u/production/e8ab60280130262c5cef11f5a02605f91941b75d-896x1344.jpg",
  },
];
