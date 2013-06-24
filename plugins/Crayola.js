/*

    Jaks - Graphic Framework for JavaScript

    Copyright (C) 2013  Fabien Bavent<fabien.bavent@gmail.com>

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Jaks.  If not, see <http://www.gnu.org/licenses/>.
*/
jaks.Crayola = {};
// Colors are base on Crayola pencil
// see: http://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors
(function () {
        this.Almond = "#EFDECD";
        this.AntiqueBrass = "#CD9575";
        this.Apricot = "#FDD9B5";
        this.Aquamarine = "#78DBE2";
        this.Asparagus = "#87A96B";
        this.AtomicTangerine = "#FFA474";
        this.BananaMania = "#FAE7B5";
        this.Beaver = "#9F8170";
        this.Bittersweet = "#FD7C6E";
        this.Black = "#000000";
        this.BlizzardBlue = "#ACE5EE";
        this.Blue = "#1F75FE";
        this.BlueBell = "#A2A2D0";
        this.BlueGray = "#6699CC";
        this.BlueGreen = "#0D98BA";
        this.BlueViolet = "#7366BD";
        this.Blush = "#DE5D83";
        this.BrickRed = "#CB4154";
        this.Brown = "#B4674D";
        this.BurntOrange = "#FF7F49";
        this.BurntSienna = "#EA7E5D";
        this.CadetBlue = "#B0B7C6";
        this.Canary = "#FFFF99";
        this.CaribbeanGreen = "#1CD3A2";
        this.CarnationPink = "#FFAACC";
        this.Cerise = "#DD4492";
        this.Cerulean = "#1DACD6";
        this.Chestnut = "#BC5D58";
        this.Copper = "#DD9475";
        this.Cornflower = "#9ACEEB";
        this.CottonCandy = "#FFBCD9";
        this.Dandelion = "#FDDB6D";
        this.Denim = "#2B6CC4";
        this.DesertSand = "#EFCDB8";
        this.Eggplant = "#6E5160";
        this.ElectricLime = "#CEFF1D";
        this.Fern = "#71BC78";
        this.ForestGreen = "#6DAE81";
        this.Fuchsia = "#C364C5";
        this.FuzzyWuzzy = "#CC6666";
        this.Gold = "#E7C697";
        this.Goldenrod = "#FCD975";
        this.GrannySmithApple = "#A8E4A0";
        this.Gray = "#95918C";
        this.Green = "#1CAC78";
        this.GreenBlue = "#1164B4";
        this.GreenYellow = "#F0E891";
        this.HotMagenta = "#FF1DCE";
        this.Inchworm = "#B2EC5D";
        this.Indigo = "#5D76CB";
        this.JazzberryJam = "#CA3767";
        this.JungleGreen = "#3BB08F";
        this.LaserLemon = "#FEFE22";
        this.Lavender = "#FCB4D5";
        this.LemonYellow = "#FFF44F";
        this.MacaroniAndCheese = "#FFBD88";
        this.Magenta = "#F664AF";
        this.MagicMint = "#AAF0D1";
        this.Mahogany = "#CD4A4C";
        this.Maize = "#EDD19C";
        this.Manatee = "#979AAA";
        this.MangoTango = "#FF8243";
        this.Maroon = "#C8385A";
        this.Mauvelous = "#EF98AA";
        this.Melon = "#FDBCB4";
        this.MidnightBlue = "#1A4876";
        this.MountainMeadow = "#30BA8F";
        this.Mulberry = "#C54B8C";
        this.NavyBlue = "#1974D2";
        this.NeonCarrot = "#FFA343";
        this.OliveGreen = "#BAB86C";
        this.Orange = "#FF7538";
        this.OrangeRed = "#FF2B2B";
        this.OrangeYellow = "#F8D568";
        this.Orchid = "#E6A8D7";
        this.OuterSpace = "#414A4C";
        this.OutrageousOrange = "#FF6E4A";
        this.PacificBlue = "#1CA9C9";
        this.Peach = "#FFCFAB";
        this.Periwinkle = "#C5D0E6";
        this.PiggyPink = "#FDDDE6";
        this.PineGreen = "#158078";
        this.PinkFlamingo = "#FC74FD";
        this.PinkSherbert = "#F78FA7";
        this.Plum = "#8E4585";
        this.PurpleHeart = "#7442C8";
        this.PurpleMountainsMajesty = "#9D81BA";
        this.PurplePizzazz = "#FE4EDA";
        this.RadicalRed = "#FF496C";
        this.RawSienna = "#D68A59";
        this.RawUmber = "#714B23";
        this.RazzleDazzleRose = "#FF48D0";
        this.Razzmatazz = "#E3256B";
        this.Red = "#EE204D";
        this.RedOrange = "#FF5349";
        this.RedViolet = "#C0448F";
        this.RobinsEggBlue = "#1FCECB";
        this.RoyalPurple = "#7851A9";
        this.Salmon = "#FF9BAA";
        this.Scarlet = "#FC2847";
        this.ScreaminGreen = "#76FF7A";
        this.SeaGreen = "#9FE2BF";
        this.Sepia = "#A5694F";
        this.Shadow = "#8A795D";
        this.Shamrock = "#45CEA2";
        this.ShockingPink = "#FB7EFD";
        this.Silver = "#CDC5C2";
        this.SkyBlue = "#80DAEB";
        this.SpringGreen = "#ECEABE";
        this.Sunglow = "#FFCF48";
        this.SunsetOrange = "#FD5E53";
        this.Tan = "#FAA76C";
        this.TealBlue = "#18A7B5";
        this.Thistle = "#EBC7DF";
        this.TickleMePink = "#FC89AC";
        this.Timberwolf = "#DBD7D2";
        this.TropicalRainForest = "#17806D";
        this.Tumbleweed = "#DEAA88";
        this.TurquoiseBlue = "#77DDE7";
        this.UnmellowYellow = "#FFFF66";
        this.Violet(Purple) = "#926EAE";
        this.VioletBlue = "#324AB2";
        this.VioletRed = "#F75394";
        this.VividTangerine = "#FFA089";
        this.VividViolet = "#8F509D";
        this.Volt = "#C5E384";
        this.White = "#FFFFFF";
        this.WildBlueYonder = "#A2ADD0";
        this.WildStrawberry = "#FF43A4";
        this.WildWatermelon = "#FC6C85";
        this.Wisteria = "#CDA4DE";
        this.Yellow = "#FCE883";
        this.YellowOrange = "#FFAE42";

}).apply(jaks.Crayola);

