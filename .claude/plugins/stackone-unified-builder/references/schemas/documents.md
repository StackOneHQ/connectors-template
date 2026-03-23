# Documents — Schema Reference

> Manage files, folders and drives.

> **OAS source:** `https://docs.stackone.com/documents/api-reference/documents.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/documents/files/{id}/download` | Download File |
| `POST` | `/unified/documents/files/upload` | Upload File |
| `GET` | `/unified/documents/files` | List Files |
| `GET` | `/unified/documents/files/{id}` | Get File |
| `GET` | `/unified/documents/folders` | List Folders |
| `GET` | `/unified/documents/folders/{id}` | Get Folder |
| `GET` | `/unified/documents/drives` | List Drives |
| `GET` | `/unified/documents/drives/{id}` | Get Drive |

---

## Models

### `Drives`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this drive |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name associated with this drive |
| `description` | `string` | The description associated with this drive |
| `url` | `string` | The url of the drive |
| `created_at` | `string` | The created date of the drive |
| `updated_at` | `string` | The last updated date of the drive |

### `Files`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name associated with this file |
| `description` | `string` | The description of the file |
| `size` | `number` | The size of this file |
| `url` | `string` | The url of the file |
| `file_format` | `FileFormatEnum` | The file format of the file |
| `path` | `string` | The path where the file is stored |
| `owner_id` | `string` | The user ID of owner of this file |
| `export_formats` | `array<string>` | List of supported export formats |
| `default_download_format` | `string` | Default download format |
| `remote_owner_id` | `string` | Provider's unique identifier of the owner of this file |
| `folder_id` | `string` | The parent folder ID associated with this file |
| `remote_folder_id` | `string` | Provider's unique identifier of the parent folder associated with this file |
| `drive_id` | `string` | The parent drive ID associated with this file |
| `remote_drive_id` | `string` | Provider's unique identifier of the parent drive associated with this file |
| `created_at` | `string` | The created date of the file |
| `updated_at` | `string` | The last updated date of the file |
| `has_content` | `object` | Whether the file has content |
| `has_children` | `object` | Whether the file has children |
| `all_parent_folder_ids` | `array<string>` | List of containing parent Folder IDs in descending order |

### `Folders`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name associated with this folder |
| `description` | `string` | The description of the folder |
| `size` | `number` | The size of this folder in bytes |
| `url` | `string` | The url of the folder |
| `path` | `string` | The path where the folder is stored |
| `owner_id` | `string` | The user ID of owner of this folder |
| `remote_owner_id` | `string` | Provider's unique identifier of the owner of this folder |
| `parent_folder_id` | `string` | The parent folder ID associated with this folder |
| `remote_parent_folder_id` | `string` | Provider's unique identifier of the parent folder associated with this folder |
| `drive_id` | `string` | The parent drive ID associated with this folder |
| `remote_drive_id` | `string` | Provider's unique identifier of the parent drive associated with this folder |
| `created_at` | `string` | The created date of the folder |
| `updated_at` | `string` | The last updated date of the folder |
| `has_content` | `object` | Whether the folder has content |
| `has_children` | `object` | Whether the folder has children |
| `is_root` | `object` | Whether the folder is at the root level of the drive |
| `all_parent_folder_ids` | `array<string>` | List of containing parent Folder IDs in descending order |

### `ProviderError`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` | HTTP status code of the provider error |
| `url` | `string` | URL that caused the error |
| `raw` | `object` | Raw error response from the provider |
| `headers` | `object` | Response headers |

### `ProviderErrorApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` |  |
| `url` | `string` |  |
| `raw` | `object` |  |
| `headers` | `object` |  |

### `UnifiedError`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` | HTTP status code |
| `message` | `string` | Error message |
| `headers` | `object` | Response headers |

### `UnifiedUploadCategoryEnumApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | The category name for associating uploaded files. |
| `source_value` | `string` | The provider specific category for associating uploaded files, if provided, the value will be ign... |

### `UnifiedWarningApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `message` | `string` |  |

### `WriteResultApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` |  |
| `message` | `string` |  |
| `timestamp` | `string` |  |
| `provider_errors` | `array<ProviderErrorApiModel>` |  |
| `unified_warnings` | `array<UnifiedWarningApiModel>` |  |

---

## Enums

| Enum | Values |
|------|--------|
| `ConfidentialEnumApiModel` | `true`, `false` |
| `FileFormatEnum` | `ez`, `aw`, `atom`, `atomcat`, `atomdeleted`, `atomsvc`, `dwd`, `held`, `rsat`, `bdoc`, `xcs`, `ccxml`, `cdfx`, `cdmia`, `cdmic`, `cdmid`, `cdmio`, `cdmiq`, `cu`, `mpd`, `davmount`, `dbk`, `dssc`, `xdssc`, `es`, `ecma`, `emma`, `emotionml`, `epub`, `exi`, `exp`, `fdt`, `pfr`, `geojson`, `gml`, `gpx`, `gxf`, `gz`, `hjson`, `stk`, `ink`, `inkml`, `ipfix`, `its`, `jar`, `war`, `ear`, `ser`, `class`, `js`, `mjs`, `json`, `map`, `json5`, `jsonml`, `jsonld`, `lgr`, `lostxml`, `hqx`, `cpt`, `mads`, `webmanifest`, `mrc`, `mrcx`, `ma`, `nb`, `mb`, `mathml`, `mbox`, `mscml`, `metalink`, `meta4`, `mets`, `maei`, `musd`, `mods`, `m21`, `mp21`, `mp4s`, `m4p`, `doc`, `dot`, `mxf`, `nq`, `nt`, `cjs`, `bin`, `dms`, `lrf`, `mar`, `so`, `dist`, `distz`, `pkg`, `bpk`, `dump`, `elc`, `deploy`, `exe`, `dll`, `deb`, `dmg`, `iso`, `img`, `msi`, `msp`, `msm`, `buffer`, `oda`, `opf`, `ogx`, `omdoc`, `onetoc`, `onetoc2`, `onetmp`, `onepkg`, `oxps`, `relo`, `xer`, `pdf`, `pgp`, `asc`, `sig`, `prf`, `p10`, `p7m`, `p7c`, `p7s`, `p8`, `ac`, `cer`, `crl`, `pkipath`, `pki`, `pls`, `ai`, `eps`, `ps`, `provx`, `pskcxml`, `raml`, `rdf`, `owl`, `rif`, `rnc`, `rl`, `rld`, `rs`, `rapd`, `sls`, `rusd`, `gbr`, `mft`, `roa`, `rsd`, `rss`, `rtf`, `sbml`, `scq`, `scs`, `spq`, `spp`, `sdp`, `senmlx`, `sensmlx`, `setpay`, `setreg`, `shf`, `siv`, `sieve`, `smi`, `smil`, `rq`, `srx`, `gram`, `grxml`, `sru`, `ssdl`, `ssml`, `swidtag`, `tei`, `teicorpus`, `tfi`, `tsd`, `toml`, `trig`, `ttml`, `ubj`, `rsheet`, `td`, `vxml`, `wasm`, `wgt`, `hlp`, `wsdl`, `wspolicy`, `xaml`, `xav`, `xca`, `xdf`, `xel`, `xns`, `xenc`, `xhtml`, `xht`, `xlf`, `xml`, `xsl`, `xsd`, `rng`, `dtd`, `xop`, `xpl`, `*xsl`, `xslt`, `xspf`, `mxml`, `xhvml`, `xvml`, `xvm`, `yang`, `yin`, `zip`, `*3gpp`, `adp`, `amr`, `au`, `snd`, `mid`, `midi`, `kar`, `rmi`, `mxmf`, `*mp3`, `m4a`, `mp4a`, `mpga`, `mp2`, `mp2a`, `mp3`, `m2a`, `m3a`, `oga`, `ogg`, `spx`, `opus`, `s3m`, `sil`, `wav`, `*wav`, `weba`, `xm`, `ttc`, `otf`, `ttf`, `woff`, `woff2`, `exr`, `apng`, `avif`, `bmp`, `cgm`, `drle`, `emf`, `fits`, `g3`, `gif`, `heic`, `heics`, `heif`, `heifs`, `hej2`, `hsj2`, `ief`, `jls`, `jp2`, `jpg2`, `jpeg`, `jpg`, `jpe`, `jph`, `jhc`, `jpm`, `jpx`, `jpf`, `jxr`, `jxra`, `jxrs`, `jxs`, `jxsc`, `jxsi`, `jxss`, `ktx`, `ktx2`, `png`, `sgi`, `svg`, `svgz`, `t38`, `tif`, `tiff`, `tfx`, `webp`, `wmf`, `disposition-notification`, `u8msg`, `u8dsn`, `u8mdn`, `u8hdr`, `eml`, `mime`, `3mf`, `gltf`, `glb`, `igs`, `iges`, `msh`, `mesh`, `silo`, `mtl`, `obj`, `stpx`, `stpz`, `stpxz`, `stl`, `wrl`, `vrml`, `*x3db`, `x3dbz`, `x3db`, `*x3dv`, `x3dvz`, `x3d`, `x3dz`, `x3dv`, `appcache`, `manifest`, `ics`, `ifb`, `coffee`, `litcoffee`, `css`, `csv`, `html`, `htm`, `shtml`, `jade`, `jsx`, `less`, `markdown`, `md`, `mml`, `mdx`, `n3`, `txt`, `text`, `conf`, `def`, `list`, `log`, `in`, `ini`, `rtx`, `*rtf`, `sgml`, `sgm`, `shex`, `slim`, `slm`, `spdx`, `stylus`, `styl`, `tsv`, `t`, `tr`, `roff`, `man`, `me`, `ms`, `ttl`, `uri`, `uris`, `urls`, `vcard`, `vtt`, `*xml`, `yaml`, `yml`, `3gp`, `3gpp`, `3g2`, `h261`, `h263`, `h264`, `m4s`, `jpgv`, `*jpm`, `jpgm`, `mj2`, `mjp2`, `ts`, `mp4`, `mp4v`, `mpg4`, `mpeg`, `mpg`, `mpe`, `m1v`, `m2v`, `ogv`, `qt`, `mov`, `webm`, `cww`, `1km`, `plb`, `psb`, `pvb`, `tcap`, `pwn`, `aso`, `imp`, `acu`, `atc`, `acutc`, `air`, `fcdt`, `fxp`, `fxpl`, `xdp`, `xfdf`, `ahead`, `azf`, `azs`, `azw`, `acc`, `ami`, `apk`, `cii`, `fti`, `atx`, `mpkg`, `key`, `m3u8`, `numbers`, `pages`, `pkpass`, `swi`, `iota`, `aep`, `bmml`, `mpm`, `bmi`, `rep`, `cdxml`, `mmd`, `cdy`, `csl`, `cla`, `rp9`, `c4g`, `c4d`, `c4f`, `c4p`, `c4u`, `c11amc`, `c11amz`, `csp`, `cdbcmsg`, `cmc`, `clkx`, `clkk`, `clkp`, `clkt`, `clkw`, `wbs`, `pml`, `ppd`, `car`, `pcurl`, `dart`, `rdz`, `dbf`, `uvf`, `uvvf`, `uvd`, `uvvd`, `uvt`, `uvvt`, `uvx`, `uvvx`, `uvz`, `uvvz`, `fe_launch`, `dna`, `mlp`, `mle`, `dpg`, `dfac`, `kpxx`, `ait`, `svc`, `geo`, `mag`, `nml`, `esf`, `msf`, `qam`, `slt`, `ssf`, `es3`, `et3`, `ez2`, `ez3`, `fdf`, `mseed`, `seed`, `dataless`, `gph`, `ftc`, `fm`, `frame`, `maker`, `book`, `fnc`, `ltf`, `fsc`, `oas`, `oa2`, `oa3`, `fg5`, `bh2`, `ddd`, `xdw`, `xbd`, `fzs`, `txd`, `ggb`, `ggt`, `gex`, `gre`, `gxt`, `g2w`, `g3w`, `gmx`, `gdoc`, `gslides`, `gsheet`, `kml`, `kmz`, `gqf`, `gqs`, `gac`, `ghf`, `gim`, `grv`, `gtm`, `tpl`, `vcg`, `hal`, `zmm`, `hbci`, `les`, `hpgl`, `hpid`, `hps`, `jlt`, `pcl`, `pclxl`, `sfd-hdstx`, `mpy`, `afp`, `listafp`, `list3820`, `irm`, `sc`, `icc`, `icm`, `igl`, `ivp`, `ivu`, `igm`, `xpw`, `xpx`, `i2g`, `qbo`, `qfx`, `rcprofile`, `irp`, `xpr`, `fcs`, `jam`, `rms`, `jisp`, `joda`, `ktz`, `ktr`, `karbon`, `chrt`, `kfo`, `flw`, `kon`, `kpr`, `kpt`, `ksp`, `kwd`, `kwt`, `htke`, `kia`, `kne`, `knp`, `skp`, `skd`, `skt`, `skm`, `sse`, `lasxml`, `lbd`, `lbe`, `apr`, `pre`, `nsf`, `org`, `scm`, `lwp`, `portpkg`, `mvt`, `mcd`, `mc1`, `cdkey`, `mwf`, `mfm`, `flo`, `igx`, `mif`, `daf`, `dis`, `mbk`, `mqy`, `msl`, `plc`, `txf`, `mpn`, `mpc`, `xul`, `cil`, `cab`, `xls`, `xlm`, `xla`, `xlc`, `xlt`, `xlw`, `xlam`, `xlsb`, `xlsm`, `xltm`, `eot`, `chm`, `ims`, `lrm`, `thmx`, `msg`, `cat`, `*stl`, `ppt`, `pps`, `pot`, `ppam`, `pptm`, `sldm`, `ppsm`, `potm`, `mpp`, `mpt`, `docm`, `dotm`, `wps`, `wks`, `wcm`, `wdb`, `wpl`, `xps`, `mseq`, `mus`, `msty`, `taglet`, `nlu`, `ntf`, `nitf`, `nnd`, `nns`, `nnw`, `*ac`, `ngdat`, `n-gage`, `rpst`, `rpss`, `edm`, `edx`, `ext`, `odc`, `otc`, `odb`, `odf`, `odft`, `odg`, `otg`, `odi`, `oti`, `odp`, `otp`, `ods`, `ots`, `odt`, `odm`, `ott`, `oth`, `xo`, `dd2`, `obgx`, `oxt`, `osm`, `pptx`, `sldx`, `ppsx`, `potx`, `xlsx`, `xltx`, `docx`, `dotx`, `mgp`, `dp`, `esa`, `pdb`, `pqa`, `oprc`, `paw`, `str`, `ei6`, `efif`, `wg`, `plf`, `pbd`, `box`, `mgz`, `qps`, `ptid`, `qxd`, `qxt`, `qwd`, `qwt`, `qxl`, `qxb`, `rar`, `bed`, `mxl`, `musicxml`, `cryptonote`, `cod`, `rm`, `rmvb`, `link66`, `st`, `see`, `sema`, `semd`, `semf`, `ifm`, `itp`, `iif`, `ipk`, `twd`, `twds`, `mmf`, `teacher`, `fo`, `sdkm`, `sdkd`, `dxp`, `sfs`, `sdc`, `sda`, `sdd`, `smf`, `sdw`, `vor`, `sgl`, `smzip`, `sm`, `wadl`, `sxc`, `stc`, `sxd`, `std`, `sxi`, `sti`, `sxm`, `sxw`, `sxg`, `stw`, `sus`, `susp`, `svd`, `sis`, `sisx`, `xsm`, `bdm`, `xdm`, `ddf`, `tao`, `pcap`, `cap`, `dmp`, `tmo`, `tpt`, `mxs`, `tra`, `ufd`, `ufdl`, `utz`, `umj`, `unityweb`, `uoml`, `vcx`, `vsd`, `vst`, `vss`, `vsw`, `vis`, `vsf`, `wbxml`, `wmlc`, `wmlsc`, `wtb`, `nbp`, `wpd`, `wqd`, `stf`, `xar`, `xfdl`, `hvd`, `hvs`, `hvp`, `osf`, `osfpvg`, `saf`, `spf`, `cmp`, `zir`, `zirz`, `zaz`, `7z`, `abw`, `ace`, `*dmg`, `arj`, `aab`, `x32`, `u32`, `vox`, `aam`, `aas`, `bcpio`, `*bdoc`, `torrent`, `blb`, `blorb`, `bz`, `bz2`, `boz`, `cbr`, `cba`, `cbt`, `cbz`, `cb7`, `vcd`, `cfs`, `chat`, `pgn`, `crx`, `cco`, `nsc`, `cpio`, `csh`, `*deb`, `udeb`, `dgc`, `dir`, `dcr`, `dxr`, `cst`, `cct`, `cxt`, `w3d`, `fgd`, `swa`, `wad`, `ncx`, `dtb`, `res`, `dvi`, `evy`, `eva`, `bdf`, `gsf`, `psf`, `pcf`, `snf`, `pfa`, `pfb`, `pfm`, `afm`, `arc`, `spl`, `gca`, `ulx`, `gnumeric`, `gramps`, `gtar`, `hdf`, `php`, `install`, `*iso`, `*key`, `*numbers`, `*pages`, `jardiff`, `jnlp`, `kdbx`, `latex`, `luac`, `lzh`, `lha`, `run`, `mie`, `prc`, `mobi`, `application`, `lnk`, `wmd`, `wmz`, `xbap`, `mdb`, `obd`, `crd`, `clp`, `*exe`, `*dll`, `com`, `bat`, `*msi`, `mvb`, `m13`, `m14`, `*wmf`, `*wmz`, `*emf`, `emz`, `mny`, `pub`, `scd`, `trm`, `wri`, `nc`, `cdf`, `pac`, `nzb`, `pl`, `pm`, `*prc`, `*pdb`, `p12`, `pfx`, `p7b`, `spc`, `p7r`, `*rar`, `rpm`, `ris`, `sea`, `sh`, `shar`, `swf`, `xap`, `sql`, `sit`, `sitx`, `srt`, `sv4cpio`, `sv4crc`, `t3`, `gam`, `tar`, `tcl`, `tk`, `tex`, `tfm`, `texinfo`, `texi`, `*obj`, `ustar`, `hdd`, `ova`, `ovf`, `vbox`, `vbox-extpack`, `vdi`, `vhd`, `vmdk`, `src`, `webapp`, `der`, `crt`, `pem`, `fig`, `*xlf`, `xpi`, `xz`, `z1`, `z2`, `z3`, `z4`, `z5`, `z6`, `z7`, `z8`, `uva`, `uvva`, `eol`, `dra`, `dts`, `dtshd`, `lvp`, `pya`, `ecelp4800`, `ecelp7470`, `ecelp9600`, `rip`, `aac`, `aif`, `aiff`, `aifc`, `caf`, `flac`, `*m4a`, `mka`, `m3u`, `wax`, `wma`, `ram`, `ra`, `rmp`, `*ra`, `cdx`, `cif`, `cmdf`, `cml`, `csml`, `xyz`, `btif`, `pti`, `psd`, `azv`, `uvi`, `uvvi`, `uvg`, `uvvg`, `djvu`, `djv`, `*sub`, `dwg`, `dxf`, `fbs`, `fpx`, `fst`, `mmr`, `rlc`, `ico`, `dds`, `mdi`, `wdp`, `npx`, `b16`, `tap`, `vtf`, `wbmp`, `xif`, `pcx`, `3ds`, `ras`, `cmx`, `fh`, `fhc`, `fh4`, `fh5`, `fh7`, `*ico`, `jng`, `sid`, `*bmp`, `*pcx`, `pic`, `pct`, `pnm`, `pbm`, `pgm`, `ppm`, `rgb`, `tga`, `xbm`, `xpm`, `xwd`, `wsc`, `dae`, `dwf`, `gdl`, `gtw`, `mts`, `ogex`, `x_b`, `x_t`, `vds`, `usdz`, `bsp`, `vtu`, `dsc`, `curl`, `dcurl`, `mcurl`, `scurl`, `sub`, `fly`, `flx`, `gv`, `3dml`, `spot`, `jad`, `wml`, `wmls`, `s`, `asm`, `c`, `cc`, `cxx`, `cpp`, `h`, `hh`, `dic`, `htc`, `f`, `for`, `f77`, `f90`, `hbs`, `java`, `lua`, `mkd`, `nfo`, `opml`, `*org`, `p`, `pas`, `pde`, `sass`, `scss`, `etx`, `sfv`, `ymp`, `uu`, `vcs`, `vcf`, `uvh`, `uvvh`, `uvm`, `uvvm`, `uvp`, `uvvp`, `uvs`, `uvvs`, `uvv`, `uvvv`, `dvb`, `fvt`, `mxu`, `m4u`, `pyv`, `uvu`, `uvvu`, `viv`, `f4v`, `fli`, `flv`, `m4v`, `mkv`, `mk3d`, `mks`, `mng`, `asf`, `asx`, `vob`, `wm`, `wmv`, `wmx`, `wvx`, `avi`, `movie`, `smv`, `ice`, `mht` |
