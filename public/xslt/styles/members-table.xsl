<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/group">  
        <table>
            <tbody>
                <tr>
                    <th>Stage name</th>
                    <th>Legal name</th>
                    <th>Native script</th>
                    <th>S/id number</th>
                    <th>Birthday</th>
                    <th>Nationality</th>
                    <th>Debut date</th>
                    <th>Symbolic color</th>
                </tr>
                <xsl:for-each select="member">
                    <tr>
                        <xsl:attribute name="style">--member-color:<xsl:value-of select="@color"/>;--contrast-color:<xsl:value-of select="@contrast"/></xsl:attribute>
                        <td><xsl:value-of select="@id"/></td>
                        <td><xsl:value-of select="name"/></td>
                        <td><xsl:value-of select="native"/></td>
                        <td><xsl:value-of select="number"/></td>
                        <td><xsl:value-of select="birthday"/></td>
                        <td><xsl:value-of select="nationality"/></td>
                        <td><xsl:value-of select="debut"/></td>
                        <td><xsl:value-of select="color"/></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>