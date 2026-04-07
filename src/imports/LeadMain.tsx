import svgPaths from "./svg-na8b6s0e6e";
import imgImageUserProfile from "figma:asset/89611a4dc21ed9a40d088700c44694d4e6bf4947.png";
import imgDropdown from "figma:asset/a10e73cff0c44f4ecb700618fa7fa7d7298d2664.png";

function Container1() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Sidebar1() {
  return (
    <div className="bg-[#9810fa] relative rounded-[4px] shrink-0 size-[24px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Sidebar2() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#101828] text-[20px]">LERVO</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[28px] relative shrink-0 w-[91.734px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Sidebar1 />
        <Sidebar2 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[77px] relative shrink-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px pl-[24px] pr-[139.266px] relative size-full">
        <Link />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 4.16667V15.8333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[62.672px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#051046] text-[14px] text-center">Add New</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] rounded-[10px] top-0 w-[231px]" data-name="Button">
      <Icon />
      <Text />
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Button />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1fc96a00} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33089d00} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p49cfa80} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1cfbf300} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar3() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Dashboard</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon1 />
      <Sidebar3 />
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar4() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Schedule</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon2 />
      <Sidebar4 />
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar5() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Leads</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bg-[#faf5ff] content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon3 />
      <Sidebar5 />
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25fc4100} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar6() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Service Plans</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon4 />
      <Sidebar6 />
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pe6b10c0} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p4c21d00} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Jobs</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Button">
      <Icon5 />
      <Text1 />
      <Icon6 />
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Button1 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pae3c380} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar7() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Clients</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon7 />
      <Sidebar7 />
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3713e00} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 7.5H6.66667" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 10.8333H6.66667" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 14.1667H6.66667" id="Vector_5" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar8() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Report</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon8 />
      <Sidebar8 />
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link6 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p20f4ecf0} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 18.3333V10" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2eca8c80} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.25 3.55833L13.75 7.85" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar9() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Inventory</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon9 />
      <Sidebar9 />
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link7 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_479_610)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3dfd2600} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_479_610">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar10() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Team</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon10 />
      <Sidebar10 />
    </div>
  );
}

function ListItem9() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link8 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_479_603)" id="Icon">
          <path d={svgPaths.p24941500} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 2.5V5.83333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 4.16667H15" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 14.1667V15.8333" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M4.16667 15H2.5" id="Vector_5" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_479_603">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar11() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Klervo AI</p>
      </div>
    </div>
  );
}

function Link9() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 px-[12px] rounded-[10px] top-0 w-[231px]" data-name="Link">
      <Icon11 />
      <Sidebar11 />
    </div>
  );
}

function ListItem10() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Link9 />
    </div>
  );
}

function List() {
  return (
    <div className="h-[480px] relative shrink-0 w-full" data-name="List">
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[12px] relative size-full">
        <ListItem />
        <ListItem1 />
        <ListItem2 />
        <ListItem3 />
        <ListItem4 />
        <ListItem5 />
        <ListItem6 />
        <ListItem7 />
        <ListItem8 />
        <ListItem9 />
        <ListItem10 />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[255px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[16px] relative rounded-[inherit] size-full">
        <List />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.ped54800} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.266px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#051046] text-[14px]">Settings</p>
      </div>
    </div>
  );
}

function Link10() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[12px] relative size-full">
          <Icon12 />
          <Sidebar12 />
        </div>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_479_598)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p22540600} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 14.1667H10.0083" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_479_598">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[31.703px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#051046] text-[14px]">Help</p>
      </div>
    </div>
  );
}

function Link11() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[12px] relative size-full">
          <Icon13 />
          <Sidebar13 />
        </div>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.5 15L7.5 10L12.5 5" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[62.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#051046] text-[14px] text-center">Collapse</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <Icon14 />
      <Text2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[153px] relative shrink-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[13px] px-[12px] relative size-full">
        <Link10 />
        <Link11 />
        <Button2 />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-white h-[870px] relative shrink-0 w-[256px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative size-full">
        <Container />
        <Navigation />
        <Container2 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#9810fa] text-[14px] whitespace-pre-wrap">Hello, John Tom</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[32px] left-0 not-italic text-[#101828] text-[24px] top-px">Leads</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#4a5565] text-[14px]">Manage and track your leads</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Paragraph />
        <Heading />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[80px] relative shrink-0 w-[205.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[8px] size-[20px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1c3efea0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25877f40} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute bg-[#fb2c36] content-stretch flex items-center justify-center left-[16px] rounded-[33554400px] size-[16px] top-[4px]" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white">3</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute left-0 rounded-[10px] size-[36px] top-[2px]" data-name="Button">
      <Icon15 />
      <Text3 />
    </div>
  );
}

function ImageUserProfile() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Image (User profile)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageUserProfile} />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#d1d5dc] content-stretch flex flex-col items-start left-[52px] overflow-clip rounded-[33554400px] size-[40px] top-0" data-name="Container">
      <ImageUserProfile />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[40px] relative shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button3 />
        <Container6 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[113px] relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[32px] relative size-full">
          <Container3 />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Option() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option1() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option2() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option3() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option4() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option5() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option6() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Dropdown() {
  return (
    <div className="absolute content-stretch flex flex-col h-[40px] items-start left-[268px] pb-px pl-[-556px] pr-[698px] pt-[-149px] rounded-[15px] top-0 w-[142px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[15px]" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
      <Option6 />
    </div>
  );
}

function Option7() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option8() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option9() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option10() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option11() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option12() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Dropdown1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[40px] items-start left-[422px] pb-px pl-[-710px] pr-[855px] pt-[-149px] rounded-[15px] top-0 w-[145px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[15px]" />
      <Option7 />
      <Option8 />
      <Option9 />
      <Option10 />
      <Option11 />
      <Option12 />
    </div>
  );
}

function Option13() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option14() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option15() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option16() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Dropdown2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[40px] items-start left-[579px] pb-px pl-[-867px] pr-[1000px] pt-[-149px] rounded-[15px] top-0 w-[133px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[15px]" />
      <Option13 />
      <Option14 />
      <Option15 />
      <Option16 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute h-[38px] left-0 rounded-[15px] top-0 w-[256px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[8px] relative rounded-[inherit] size-full">
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(5,16,70,0.5)]">Search leads...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[15px]" />
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[38px] left-0 top-px w-[256px]" data-name="Container">
      <TextInput />
      <Icon16 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[40px] relative shrink-0 w-[712px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Dropdown />
        <Dropdown1 />
        <Dropdown2 />
        <Container9 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 4.16667V15.8333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#9473ff] h-[48px] relative rounded-[32px] shrink-0 w-[151.688px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon17 />
        <p className="-translate-x-1/2 absolute font-['Poppins:Medium',sans-serif] leading-[24px] left-[90px] not-italic text-[16px] text-center text-white top-[12px]">Add Lead</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Button4 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Total Leads</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#051046] text-[30px] top-0">7</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[16px] opacity-70 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#051046] text-[12px] top-0 w-[117px] whitespace-pre-wrap">Total Value: $41,600</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#f8efff] col-1 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_2px_16px_0px_rgba(226,232,240,0.5)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[25px] px-[25px] relative size-full">
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Win Rate</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#051046] text-[30px] top-0 w-[85px] whitespace-pre-wrap">14.3%</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[16px] opacity-70 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#051046] text-[12px] top-0 w-[56px] whitespace-pre-wrap">Won: 1 / 7</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[#a6e4fa] col-2 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_2px_16px_0px_rgba(226,232,240,0.5)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[25px] px-[25px] relative size-full">
        <Container16 />
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Lost Rate</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#051046] text-[30px] top-0 w-[85px] whitespace-pre-wrap">14.3%</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[16px] opacity-70 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#051046] text-[12px] top-0 w-[52px] whitespace-pre-wrap">Lost: 1 / 7</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#ffdbe6] col-3 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_2px_16px_0px_rgba(226,232,240,0.5)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[25px] px-[25px] relative size-full">
        <Container20 />
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Active Leads</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#051046] text-[30px] top-0">5</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[16px] opacity-70 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#051046] text-[12px] top-0 w-[128px] whitespace-pre-wrap">Active Value: $36,000</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[#e2f685] col-4 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_2px_16px_0px_rgba(226,232,240,0.5)]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[25px] px-[25px] relative size-full">
        <Container24 />
        <Container25 />
        <Container26 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[134px] relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container15 />
      <Container19 />
      <Container23 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute h-[48.5px] left-0 top-0 w-[467.391px]" data-name="Header Cell">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[16px] left-[24px] not-italic text-[#051046] text-[12px] top-[16px] tracking-[0.6px] uppercase">Client</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute h-[48.5px] left-[467.39px] top-0 w-[333.266px]" data-name="Header Cell">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[16px] left-[24px] not-italic text-[#051046] text-[12px] top-[16px] tracking-[0.6px] uppercase">Service</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute h-[48.5px] left-[800.66px] top-0 w-[200.953px]" data-name="Header Cell">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[16px] left-[24px] not-italic text-[#051046] text-[12px] top-[16px] tracking-[0.6px] uppercase">Value</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute h-[48.5px] left-[1001.61px] top-0 w-[264.094px]" data-name="Header Cell">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[16px] left-[24px] not-italic text-[#051046] text-[12px] top-[16px] tracking-[0.6px] uppercase">Stage</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute h-[48.5px] left-[1265.7px] top-0 w-[182.516px]" data-name="Header Cell">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[16px] left-[24px] not-italic text-[#051046] text-[12px] top-[16px] tracking-[0.6px] uppercase">Priority</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute h-[48.5px] left-[1448.22px] top-0 w-[134.781px]" data-name="Header Cell">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[16px] left-[24px] not-italic text-[#051046] text-[12px] top-[16px] tracking-[0.6px] uppercase">Days</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[48.5px] left-0 top-0 w-[1583px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute bg-[#f9fafb] border-[#e2e8f0] border-b border-solid h-[48.5px] left-0 top-0 w-[1583px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">Michael Roberts</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">michael.roberts@email.com</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[44px] relative shrink-0 w-[198.266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container30 />
      <Container31 />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container29 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">HVAC Installation</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[77px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container34 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon19 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[56px] whitespace-pre-wrap">$8,500</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[77px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container35 />
    </div>
  );
}

function Option17() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-447px]" data-name="Option" />;
}

function Option18() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-447px]" data-name="Option" />;
}

function Option19() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-447px]" data-name="Option" />;
}

function Option20() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-447px]" data-name="Option" />;
}

function Option21() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-447px]" data-name="Option" />;
}

function Option22() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-447px]" data-name="Option" />;
}

function Dropdown3() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#3b82f6] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#3b82f6] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option17 />
      <Option18 />
      <Option19 />
      <Option20 />
      <Option21 />
      <Option22 />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[77px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.13)] border border-[rgba(239,68,68,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[49.563px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#ef4444] text-[12px] top-[2px]">High</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[77px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text4 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon20 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[14px] whitespace-pre-wrap">1d</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[77px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container36 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[77px] left-0 top-0 w-[1583px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon21 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">Sarah Martinez</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">sarah.martinez@email.com</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[44px] relative shrink-0 w-[193.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container38 />
      <Container39 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container37 />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Plumbing Repair</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[77px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container42 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon22 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[51px] whitespace-pre-wrap">$1,200</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[77px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container43 />
    </div>
  );
}

function Option23() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-524px]" data-name="Option" />;
}

function Option24() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-524px]" data-name="Option" />;
}

function Option25() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-524px]" data-name="Option" />;
}

function Option26() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-524px]" data-name="Option" />;
}

function Option27() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-524px]" data-name="Option" />;
}

function Option28() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-524px]" data-name="Option" />;
}

function Dropdown4() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#3b82f6] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#3b82f6] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option23 />
      <Option24 />
      <Option25 />
      <Option26 />
      <Option27 />
      <Option28 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[77px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute bg-[rgba(245,158,11,0.13)] border border-[rgba(245,158,11,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[71.563px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#f59e0b] text-[12px] top-[2px]">Medium</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[77px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text5 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon23 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[18px] whitespace-pre-wrap">2d</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[77px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container44 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[77px] left-0 top-[77px] w-[1583px]" data-name="Table Row">
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">David Chen</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">david.chen@email.com</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[44px] relative shrink-0 w-[166.188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container48 />
        <Container49 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container46 />
      <Container47 />
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container45 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Electrical Panel Upgrade</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[77px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container50 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon25 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[57px] whitespace-pre-wrap">$4,500</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[77px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container51 />
    </div>
  );
}

function Option29() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-601px]" data-name="Option" />;
}

function Option30() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-601px]" data-name="Option" />;
}

function Option31() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-601px]" data-name="Option" />;
}

function Option32() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-601px]" data-name="Option" />;
}

function Option33() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-601px]" data-name="Option" />;
}

function Option34() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-601px]" data-name="Option" />;
}

function Dropdown5() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#10b981] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#10b981] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option29 />
      <Option30 />
      <Option31 />
      <Option32 />
      <Option33 />
      <Option34 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[77px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.13)] border border-[rgba(239,68,68,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[49.563px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#ef4444] text-[12px] top-[2px]">High</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[77px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon26 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[14px] whitespace-pre-wrap">1d</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[77px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container52 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[77px] left-0 top-[154px] w-[1583px]" data-name="Table Row">
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">Jennifer Wilson</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">jennifer.wilson@email.com</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[44px] relative shrink-0 w-[187.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container56 />
        <Container57 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container54 />
      <Container55 />
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container53 />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Roofing Replacement</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[77px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container58 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon28 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[62px] whitespace-pre-wrap">$15,000</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[77px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container59 />
    </div>
  );
}

function Option35() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-678px]" data-name="Option" />;
}

function Option36() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-678px]" data-name="Option" />;
}

function Option37() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-678px]" data-name="Option" />;
}

function Option38() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-678px]" data-name="Option" />;
}

function Option39() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-678px]" data-name="Option" />;
}

function Option40() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-678px]" data-name="Option" />;
}

function Dropdown6() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#f59e0b] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#f59e0b] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option35 />
      <Option36 />
      <Option37 />
      <Option38 />
      <Option39 />
      <Option40 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[77px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.13)] border border-[rgba(239,68,68,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[49.563px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#ef4444] text-[12px] top-[2px]">High</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[77px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon29 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[18px] whitespace-pre-wrap">3d</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[77px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container60 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[77px] left-0 top-[231px] w-[1583px]" data-name="Table Row">
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container62() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon30 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">Robert Thompson</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">robert.thompson@email.com</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[44px] relative shrink-0 w-[206.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container64 />
        <Container65 />
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container62 />
      <Container63 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container61 />
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Landscaping</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[77px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container66 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon31 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[56px] whitespace-pre-wrap">$6,800</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[77px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container67 />
    </div>
  );
}

function Option41() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-755px]" data-name="Option" />;
}

function Option42() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-755px]" data-name="Option" />;
}

function Option43() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-755px]" data-name="Option" />;
}

function Option44() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-755px]" data-name="Option" />;
}

function Option45() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-755px]" data-name="Option" />;
}

function Option46() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-755px]" data-name="Option" />;
}

function Dropdown7() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#8b5cf6] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#8b5cf6] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option41 />
      <Option42 />
      <Option43 />
      <Option44 />
      <Option45 />
      <Option46 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[77px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[rgba(245,158,11,0.13)] border border-[rgba(245,158,11,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[71.563px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#f59e0b] text-[12px] top-[2px]">Medium</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[77px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text8 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon32 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[19px] whitespace-pre-wrap">5d</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[77px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container68 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[77px] left-0 top-[308px] w-[1583px]" data-name="Table Row">
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">Amanda Lee</p>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">amanda.lee@email.com</p>
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[44px] relative shrink-0 w-[173.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container72 />
        <Container73 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container70 />
      <Container71 />
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container69 />
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">HVAC Maintenance</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[77px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container74 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon34 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[54px] whitespace-pre-wrap">$3,200</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[77px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container75 />
    </div>
  );
}

function Option47() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-832px]" data-name="Option" />;
}

function Option48() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-832px]" data-name="Option" />;
}

function Option49() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-832px]" data-name="Option" />;
}

function Option50() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-832px]" data-name="Option" />;
}

function Option51() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-832px]" data-name="Option" />;
}

function Option52() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-832px]" data-name="Option" />;
}

function Dropdown8() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#22c55e] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#22c55e] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option47 />
      <Option48 />
      <Option49 />
      <Option50 />
      <Option51 />
      <Option52 />
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[77px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.13)] border border-[rgba(16,185,129,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[44.891px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#10b981] text-[12px] top-[2px]">Low</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[77px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text9 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon35 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[18px] whitespace-pre-wrap">2d</p>
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[77px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container76 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[77px] left-0 top-[385px] w-[1583px]" data-name="Table Row">
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container78() {
  return (
    <div className="bg-[#f3e8ff] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex h-[24px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#051046] text-[16px] whitespace-pre-wrap">James Anderson</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px]">james.anderson@email.com</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[44px] relative shrink-0 w-[201.766px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container80 />
        <Container81 />
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[16.5px] w-[419.391px]" data-name="Container">
      <Container78 />
      <Container79 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[76.5px] left-0 top-0 w-[467.391px]" data-name="Table Cell">
      <Container77 />
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-[28.5px] w-[285.266px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#051046] text-[14px] whitespace-pre-wrap">Painting</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[76.5px] left-[467.39px] top-0 w-[333.266px]" data-name="Table Cell">
      <Container82 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="absolute left-0 size-[16px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 1.33333V14.6667" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pfd86880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[26.5px] w-[152.953px]" data-name="Container">
      <Icon37 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[22px] not-italic text-[#00a63e] text-[16px] top-0 w-[55px] whitespace-pre-wrap">$2,400</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[76.5px] left-[800.66px] top-0 w-[200.953px]" data-name="Table Cell">
      <Container83 />
    </div>
  );
}

function Option53() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-909px]" data-name="Option" />;
}

function Option54() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-909px]" data-name="Option" />;
}

function Option55() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-909px]" data-name="Option" />;
}

function Option56() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-909px]" data-name="Option" />;
}

function Option57() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-909px]" data-name="Option" />;
}

function Option58() {
  return <div className="absolute left-[-1314.61px] size-0 top-[-909px]" data-name="Option" />;
}

function Dropdown9() {
  return (
    <div className="absolute h-[32px] left-[24px] rounded-[10px] top-[22.5px] w-[125px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[10px]">
        <div className="absolute bg-[#ef4444] inset-0 rounded-[10px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          <img alt="" className="absolute h-1/2 left-0 max-w-none top-1/4 w-[12.8%]" src={imgDropdown} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#ef4444] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Option53 />
      <Option54 />
      <Option55 />
      <Option56 />
      <Option57 />
      <Option58 />
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[76.5px] left-[1001.61px] top-0 w-[264.094px]" data-name="Table Cell">
      <Dropdown9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.13)] border border-[rgba(16,185,129,0.25)] border-solid h-[22px] left-[24px] rounded-[33554400px] top-[28.5px] w-[44.891px]" data-name="Text">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[16px] left-[10px] not-italic text-[#10b981] text-[12px] top-[2px]">Low</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[76.5px] left-[1265.7px] top-0 w-[182.516px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_479_639)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_479_639">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container84() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[28.5px] w-[86.781px]" data-name="Container">
      <Icon38 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[22px] not-italic text-[#4a5565] text-[14px] top-0 w-[18px] whitespace-pre-wrap">7d</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[76.5px] left-[1448.22px] top-0 w-[134.781px]" data-name="Table Cell">
      <Container84 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute h-[76.5px] left-0 top-[462px] w-[1583px]" data-name="Table Row">
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[538.5px] left-0 top-[48.5px] w-[1583px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[587px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Container87() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-0 w-[168px] whitespace-pre-wrap">Showing 1 to 7 of 7 leads</p>
      </div>
    </div>
  );
}

function Option59() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option60() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option61() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Option62() {
  return <div className="h-0 shrink-0 w-full" data-name="Option" />;
}

function Dropdown10() {
  return (
    <div className="h-[36px] relative rounded-[10px] shrink-0 w-[136px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pl-[-496.734px] pr-[632.734px] pt-[-980px] relative size-full">
        <Option59 />
        <Option60 />
        <Option61 />
        <Option62 />
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="h-[36px] relative shrink-0 w-[319.734px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container87 />
        <Dropdown10 />
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 9.33333">
            <path d={svgPaths.p2ab2d800} id="Vector" stroke="var(--stroke-0, #051046)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="opacity-50 relative rounded-[10px] shrink-0 size-[34px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[9px] px-[9px] relative size-full">
        <Icon39 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#9473ff] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[10px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:Medium',sans-serif] leading-[20px] left-[16.05px] not-italic text-[14px] text-center text-white top-[6px]">1</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button6 />
      </div>
    </div>
  );
}

function Icon40() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 9.33333">
            <path d={svgPaths.p3ec8f700} id="Vector" stroke="var(--stroke-0, #051046)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="flex-[1_0_0] h-[34px] min-h-px min-w-px opacity-50 relative rounded-[10px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[9px] px-[9px] relative size-full">
        <Icon40 />
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[34px] relative shrink-0 w-[116px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button5 />
        <Container89 />
        <Button7 />
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="h-[69px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pt-px px-[24px] relative size-full">
          <Container86 />
          <Container88 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[20px] w-[1585px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Table />
        <Container85 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_2px_16px_2px_rgba(226,232,240,0.5)]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col h-[658px] items-start relative shrink-0 w-full" data-name="Container">
      <Container28 />
    </div>
  );
}

function LeadsPage() {
  return (
    <div className="h-[952px] relative shrink-0 w-full" data-name="LeadsPage">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[32px] px-[32px] relative size-full">
        <Container7 />
        <Container10 />
        <Container27 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] h-[870px] min-h-px min-w-px relative" data-name="Main Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[15px] relative size-full">
          <Header />
          <LeadsPage />
        </div>
      </div>
    </div>
  );
}

function RootLayout() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex h-[870px] items-start relative shrink-0 w-full" data-name="RootLayout">
      <Sidebar />
      <MainContent />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[870px] items-start left-0 top-0 w-[1920px]" data-name="Body">
      <RootLayout />
    </div>
  );
}

function GrammarlyDesktopIntegration() {
  return <div className="absolute left-0 size-0 top-[870px]" data-name="Grammarly-desktop-integration" />;
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1023c700} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function RootLayout1() {
  return (
    <div className="absolute bg-[#00d3f3] content-stretch flex items-center justify-center left-[1840px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[56px] top-[790px]" data-name="RootLayout">
      <Icon41 />
    </div>
  );
}

export default function LeadMain() {
  return (
    <div className="bg-white relative size-full" data-name="Lead (main)">
      <Body />
      <GrammarlyDesktopIntegration />
      <RootLayout1 />
    </div>
  );
}